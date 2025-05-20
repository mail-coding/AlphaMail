import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { productService } from '../../../services/productService';
import { s3Service } from '../../../services/s3Service';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { TooltipPortal } from '@/shared/components/atoms/TooltipPortal';
import { toast } from 'react-toastify';
import { Spinner } from '@/shared/components/atoms/spinner';

interface ProductDetailTemplateProps {
  onBack?: () => void;
}

interface ProductDetailForm {
  name: string;
  standard: string;
  stock: number;
  inboundPrice: number;
  outboundPrice: number;
  image?: string;
  imageUrl?: string;
  companyId: number;
}

export const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({ 
  onBack
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const [formData, setFormData] = useState<ProductDetailForm>({
    name: '',
    standard: '',
    stock: 0,
    inboundPrice: 0,
    outboundPrice: 0,
    companyId: userInfo?.companyId || 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorImage, setErrorImage] = useState(false);

  // input refs
  const nameRef = useRef<HTMLInputElement>(null);
  const standardRef = useRef<HTMLInputElement>(null);
  const inboundPriceRef = useRef<HTMLInputElement>(null);
  const outboundPriceRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 말풍선 위치 상태
  const [tooltip, setTooltip] = useState<{
    key: string;
    message: string;
    position: { top: number; left: number };
  } | null>(null);

  const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
  
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
  
      img.src = url;
  
      // Safari 캐시 우회 방지 (필요시)
      // img.src = `${url}?cacheBust=${Date.now()}`;
    });
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id || id === 'new') return;
  
      try {
        setIsLoading(true);
        setError(null);
        const productDetail = await productService.getProduct(id);
  
        let validImageUrl: string | undefined = undefined;
        if (productDetail.image) {
          const isValid = await validateImageUrl(productDetail.image);
          if (isValid) {
            validImageUrl = productDetail.image;
          }
        }
  
        setFormData({
          name: productDetail.name,
          standard: productDetail.standard,
          stock: productDetail.stock,
          inboundPrice: productDetail.inboundPrice,
          outboundPrice: productDetail.outboundPrice,
          imageUrl: validImageUrl,
          companyId: userInfo?.companyId || 0,
        });
      } catch (err) {
        console.error('상품 상세 정보 조회 실패:', err);
        setError('상품 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProductDetail();
  }, [id, userInfo?.companyId]);
  

  useEffect(() => {
    if (!isSubmitted) {
      setTooltip(null);
      return;
    }
    // 우선순위: name > standard > inboundPrice > outboundPrice > stock
    if (!formData.name.trim() || formData.name.length > 255) {
      const rect = nameRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'name',
        message: !formData.name.trim() ? '품목명을 입력해 주세요.' : '255자 이하로 입력해 주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    if (!formData.standard.trim()) {
      const rect = standardRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'standard',
        message: '규격을 입력해 주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    if (
      formData.inboundPrice === undefined ||
      formData.inboundPrice === null ||
      String(formData.inboundPrice).trim() === '' ||
      isNaN(Number(formData.inboundPrice))
    ) {
      const rect = inboundPriceRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'inboundPrice',
        message: '입고단가를 입력해 주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    } else if (Number(formData.inboundPrice) < 0 || Number(formData.inboundPrice) > 9223372036854775808) {
      const rect = inboundPriceRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'inboundPrice',
        message: '0 ~ 9223372036854775808 사이의 금액을 입력해 주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    if (
      formData.outboundPrice === undefined ||
      formData.outboundPrice === null ||
      String(formData.outboundPrice).trim() === '' ||
      isNaN(Number(formData.outboundPrice))
    ) {
      const rect = outboundPriceRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'outboundPrice',
        message: '출고단가를 입력해 주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    } else if (Number(formData.outboundPrice) < 0 || Number(formData.outboundPrice) > 9223372036854775808) {
      const rect = outboundPriceRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'outboundPrice',
        message: '0 ~ 9223372036854775808 사이의 금액을 입력해 주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    if (
      formData.stock !== undefined &&
      formData.stock !== null &&
      String(formData.stock).trim() !== '' &&
      (!/^-?\d+$/.test(String(formData.stock)) || Number(formData.stock) < 0 || Number(formData.stock) > 2100000000)
    ) {
      const rect = stockRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'stock',
        message: '0 ~ 2,100,000,000 사이의 값만 입력할 수 있습니다.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    setTooltip(null);
  }, [isSubmitted, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'inboundPrice' || name === 'outboundPrice' 
        ? Number(value) 
        : value
    }));
    setTooltip(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 파일 확장자 검사
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        toast.error('이미지는 .png, .jpg, .jpeg 파일만 업로드할 수 있습니다.');
        return;
      }

      // 파일 크기 제한 (2MB)
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error('이미지는 2MB 이하만 업로드할 수 있습니다.');
        return;
      }

      // MIME 타입 검사
      if (!file.type.startsWith('image/')) {
        toast.error('유효한 이미지 파일이 아닙니다.');
        return;
      }

      // 이미지 유효성 검사
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const img = new Image();
          img.onload = () => {
            // 유효한 이미지인 경우에만 상태 업데이트
            setImageFile(file);
            setImageUrl(ev.target?.result as string);
          };
          img.onerror = () => {
            toast.error('손상되었거나 유효하지 않은 이미지 파일입니다.');
          };
          img.src = ev.target?.result as string;
        } catch (error) {
          toast.error('이미지 파일을 읽는 중 오류가 발생했습니다.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: ProductDetailForm) => 
      productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'all'
      });
      if (onBack) {
        onBack();
      } else {
        navigate('/work/products');
      }
    },
    onError: (error) => {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductDetailForm) => 
      productService.updateProduct(id!, {
        id: Number(id),
        ...data,
        companyId: userInfo?.companyId || 0
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'all'
      });
      if (onBack) {
        onBack();
      } else {
        navigate('/work/products');
      }
    },
    onError: (error) => {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // 유효성 검사
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = '품목명을 입력해 주세요.';
    } else if (formData.name.length > 255) {
      errors.name = '255자 이하로 입력해 주세요.';
    }
    if (!formData.standard.trim()) {
      errors.standard = '규격을 입력해 주세요.';
    }
    if (
      formData.inboundPrice === undefined ||
      formData.inboundPrice === null ||
      String(formData.inboundPrice).trim() === '' ||
      isNaN(Number(formData.inboundPrice))
    ) {
      errors.inboundPrice = '입고단가를 입력해 주세요.';
    } else if (Number(formData.inboundPrice) < 0 || Number(formData.inboundPrice) > 9223372036854775808) {
      errors.inboundPrice = '유효하지 않은 값입니다.';
    }
    if (
      formData.outboundPrice === undefined ||
      formData.outboundPrice === null ||
      String(formData.outboundPrice).trim() === '' ||
      isNaN(Number(formData.outboundPrice))
    ) {
      errors.outboundPrice = '출고단가를 입력해 주세요.';
    } else if (Number(formData.outboundPrice) < 0 || Number(formData.outboundPrice) > 9223372036854775808) {
      errors.outboundPrice = '유효하지 않은 값입니다.';
    }
    if (
      formData.stock !== undefined &&
      formData.stock !== null &&
      String(formData.stock).trim() !== '' &&
      (!/^-?\d+$/.test(String(formData.stock)) || Number(formData.stock) < 0 || Number(formData.stock) > 2100000000)
    ) {
      errors.stock = '유효하지 않은 값입니다.';
    }
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      let finalImageUrl = formData.imageUrl;

      // 새로운 이미지가 선택된 경우에만 업로드
      if (imageFile) {
        try {
          // TODO:기존 이미지가 있다면 삭제
          // if (formData.imageUrl) {
          //   await s3Service.deleteImage(formData.imageUrl);
          // }
          
          // 새 이미지 업로드
          finalImageUrl = await s3Service.uploadImage(imageFile);
        } catch (error) {
          console.error('이미지 처리 실패:', error);
          toast.error('이미지 업로드에 실패했습니다.');
          return;
        }
      }

      const submitData = {
        ...formData,
        image: finalImageUrl
      };

      if (id && id !== 'new') {
        await updateMutation.mutateAsync(submitData);
        toast.success('상품이 수정되었습니다.');
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success('상품이 등록되었습니다.');
      }

      if (onBack) {
        onBack();
      } else {
        navigate('/work/products');
      }
    } catch (error) {
      console.error('상품 저장 실패:', error);
      toast.error('상품 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지가 바뀔 때마다 errorImage를 초기화
  useEffect(() => {
    setErrorImage(false);
  }, [imageUrl, formData.imageUrl]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="titleMedium">
          {id && id !== 'new' ? '상품 상세' : '상품 등록'}
        </Typography>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← 목록으로
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-row items-start gap-8">
          {/* 왼쪽: 이미지 업로드/미리보기 */}
          <div className="w-[220px] min-w-[160px] bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">상품 이미지</label>
            <div
              className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer border border-gray-300 mb-2"
              onClick={() => fileInputRef.current?.click()}
            >
              {(imageUrl || formData.imageUrl) && (!errorImage || imageUrl) ? (
                <img
                  src={imageUrl || formData.imageUrl}
                  alt="상품 이미지 미리보기"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setErrorImage(true);
                  }}
                />
              ) : (
                <span className="text-2xl font-medium text-gray-700">+</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <Button
              type="button"
              size="small"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>사진 변경</span>
            </Button>
          </div>
          {/* 오른쪽: 입력폼 전체 (표 스타일) */}
          <div className="flex-1 overflow-x-auto">
            <table className="border-separate border-spacing-0 w-full">
              <colgroup>
                <col style={{ width: '120px' }} />
                <col style={{ width: '320px' }} />
              </colgroup>
              <tbody>
                {/* 품목명 */}
                <tr>
                  <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                    <Typography variant="body">품목명 <span className="text-red-500">*</span></Typography>
                  </td>
                  <td className="bg-white border border-[#E5E5E5] px-2">
                    <Input
                      ref={nameRef}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="품목명을 입력하세요"
                      size="large"
                      className="!w-[300px]"
                      maxLength={255}
                    />
                  </td>
                </tr>
                {/* 규격 */}
                <tr>
                  <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                    <Typography variant="body">규격 <span className="text-red-500">*</span></Typography>
                  </td>
                  <td className="bg-white border border-[#E5E5E5] px-2">
                    <Input
                      ref={standardRef}
                      type="text"
                      name="standard"
                      value={formData.standard}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="규격을 입력하세요"
                      size="large"
                      className="!w-[300px]"
                      maxLength={255}
                    />
                  </td>
                </tr>
                {/* 입고단가 */}
                <tr>
                  <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                    <Typography variant="body">입고단가 <span className="text-red-500">*</span></Typography>
                  </td>
                  <td className="bg-white border border-[#E5E5E5] px-2">
                    <div className="flex items-center">
                      <Input
                        ref={inboundPriceRef}
                        type="number"
                        name="inboundPrice"
                        value={formData.inboundPrice || ''}
                        onChange={handleInputChange}
                        onFocus={() => setTooltip(null)}
                        placeholder="0"
                        size="large"
                        className="text-right !w-[300px]"
                      />
                      <span className="ml-2 text-gray-500">원</span>
                    </div>
                  </td>
                </tr>
                {/* 출고단가 */}
                <tr>
                  <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                    <Typography variant="body">출고단가 <span className="text-red-500">*</span></Typography>
                  </td>
                  <td className="bg-white border border-[#E5E5E5] px-2">
                    <div className="flex items-center">
                      <Input
                        ref={outboundPriceRef}
                        type="number"
                        name="outboundPrice"
                        value={formData.outboundPrice || ''}
                        onChange={handleInputChange}
                        onFocus={() => setTooltip(null)}
                        placeholder="0"
                        size="large"
                        className="text-right !w-[300px]"
                      />
                      <span className="ml-2 text-gray-500">원</span>
                    </div>
                  </td>
                </tr>
                {/* 재고 */}
                <tr>
                  <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                    <Typography variant="body">재고</Typography>
                  </td>
                  <td className="bg-white border border-[#E5E5E5] px-2">
                    <Input
                      ref={stockRef}
                      type="number"
                      name="stock"
                      value={formData.stock || ''}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="0"
                      size="large"
                      className="text-right !w-[300px]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
        <Button
            variant="primary"
            type="submit"
          >
            {id && id !== 'new' ? '수정' : '등록'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBack ? onBack : () => navigate('/work/products')}
          >
            취소
          </Button>

        </div>
      </form>

      {/* Portal로 말풍선 렌더링 */}
      {tooltip && (
        <TooltipPortal position={tooltip.position}>
          <div className="bg-red-500 text-white text-xs rounded px-3 py-1 relative shadow" style={{ transform: 'translateX(-50%) translateY(-100%)' }}>
            {tooltip.message}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500" />
          </div>
        </TooltipPortal>
      )}
    </div>
  );
}; 
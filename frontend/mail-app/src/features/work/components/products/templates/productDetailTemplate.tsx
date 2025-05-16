import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { productService } from '../../../services/productService';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { TooltipPortal } from '@/shared/components/atoms/TooltipPortal';

interface ProductDetailTemplateProps {
  onBack?: () => void;
}

interface ProductDetailForm {
  name: string;
  standard: string;
  stock: number;
  inboundPrice: number;
  outboundPrice: number;
  image?: File;
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

  // input refs
  const nameRef = useRef<HTMLInputElement>(null);
  const standardRef = useRef<HTMLInputElement>(null);
  const inboundPriceRef = useRef<HTMLInputElement>(null);
  const outboundPriceRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);

  // 말풍선 위치 상태
  const [tooltip, setTooltip] = useState<{
    key: string;
    message: string;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id || id === 'new') return;
      
      try {
        setIsLoading(true);
        setError(null);
        const productDetail = await productService.getProduct(id);
        setFormData({
          name: productDetail.name,
          standard: productDetail.standard,
          stock: productDetail.stock,
          inboundPrice: productDetail.inboundPrice,
          outboundPrice: productDetail.outboundPrice,
          imageUrl: productDetail.image,
          companyId: userInfo?.companyId || 0
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
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
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
      errors.inboundPrice = '0 ~ 9223372036854775808 사이의 금액을 입력해 주세요.';
    }
    if (
      formData.outboundPrice === undefined ||
      formData.outboundPrice === null ||
      String(formData.outboundPrice).trim() === '' ||
      isNaN(Number(formData.outboundPrice))
    ) {
      errors.outboundPrice = '출고단가를 입력해 주세요.';
    } else if (Number(formData.outboundPrice) < 0 || Number(formData.outboundPrice) > 9223372036854775808) {
      errors.outboundPrice = '0 ~ 9223372036854775808 사이의 금액을 입력해 주세요.';
    }
    if (
      formData.stock !== undefined &&
      formData.stock !== null &&
      String(formData.stock).trim() !== '' &&
      (!/^-?\d+$/.test(String(formData.stock)) || Number(formData.stock) < 0 || Number(formData.stock) > 2100000000)
    ) {
      errors.stock = '0 ~ 2,100,000,000 사이의 값만 입력할 수 있습니다.';
    }
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      if (id && id !== 'new') {
        updateMutation.mutate(formData);
      } else {
        createMutation.mutate(formData);
      }
    } catch (error) {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="p-6">로딩 중...</div>;
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
        {/* 표 스타일 입력폼 */}
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: '120px' }} />
              <col style={{ width: '220px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '220px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '120px' }} />
            </colgroup>
            <tbody>
              {/* 1행: 품목명(3칸), 규격(2칸) */}
              <tr>
                <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                  <Typography variant="body" className="text-center">품목명<span className="text-red-500 ml-1">*</span></Typography>
                </td>
                <td className="bg-white border border-[#E5E5E5] px-2" colSpan={3}>
                  <div className="relative flex items-center">
                    <Input
                      ref={nameRef}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="품목명을 입력하세요"
                      size="large"
                    />
                  </div>
                </td>
                <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                  <Typography variant="body" className="text-center">규격<span className="text-red-500 ml-1">*</span></Typography>
                </td>
                <td className="bg-white border border-[#E5E5E5] px-2">
                  <div className="relative flex items-center">
                    <Input
                      ref={standardRef}
                      type="text"
                      name="standard"
                      value={formData.standard}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="규격을 입력하세요"
                      size="large"
                    />
                  </div>
                </td>
              </tr>
              {/* 2행: 입고단가, 출고단가, 재고 */}
              <tr>
                <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                  <Typography variant="body" className="text-center">입고단가<span className="text-red-500 ml-1">*</span></Typography>
                </td>
                <td className="bg-white border border-[#E5E5E5] px-2">
                  <div className="relative flex items-center">
                    <Input
                      ref={inboundPriceRef}
                      type="number"
                      name="inboundPrice"
                      value={formData.inboundPrice || ''}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="0"
                      size="large"
                      className="text-right"
                    />
                    <Typography variant="body" className="ml-2 text-gray-500">원</Typography>
                  </div>
                </td>
                <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                  <Typography variant="body" className="text-center">출고단가<span className="text-red-500 ml-1">*</span></Typography>
                </td>
                <td className="bg-white border border-[#E5E5E5] px-2">
                  <div className="relative flex items-center">
                    <Input
                      ref={outboundPriceRef}
                      type="number"
                      name="outboundPrice"
                      value={formData.outboundPrice || ''}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="0"
                      size="large"
                      className="text-right"
                    />
                    <Typography variant="body" className="ml-2 text-gray-500">원</Typography>
                  </div>
                </td>
                <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                  <Typography variant="body" className="text-center">재고</Typography>
                </td>
                <td className="bg-white border border-[#E5E5E5] px-2">
                  <div className="relative flex items-center">
                    <Input
                      ref={stockRef}
                      type="number"
                      name="stock"
                      value={formData.stock || ''}
                      onChange={handleInputChange}
                      onFocus={() => setTooltip(null)}
                      placeholder="0"
                      size="large"
                      className="text-right"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 이미지 업로드 섹션 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 이미지 업로드 섹션 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상품 이미지</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {(formData.image || formData.imageUrl) && (
              <div className="mt-4">
                <img 
                  src={formData.image ? URL.createObjectURL(formData.image) : formData.imageUrl} 
                  alt="상품 이미지 미리보기"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
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
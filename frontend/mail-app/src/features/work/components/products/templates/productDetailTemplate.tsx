import React, { useState, useEffect } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Product } from '../../../types/product';
import { productService } from '../../../services/productService';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

interface ProductDetailTemplateProps {
  product?: Product;
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
  product, 
  onBack
}) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!product?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const productDetail = await productService.getProduct(product.id.toString());
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
  }, [product?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'inboundPrice' || name === 'outboundPrice' 
        ? Number(value) 
        : value
    }));
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
      productService.createProduct(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'all'
      });
      if (onBack) {
        onBack();
      } else {
        navigate('/products');
      }
    },
    onError: (error) => {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductDetailForm) => 
      productService.updateProduct(product!.id.toString(), {
        id: product!.id,
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
        navigate('/products');
      }
    },
    onError: (error) => {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
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
        <Typography variant="titleLarge">
          {product ? '상품 상세' : '상품 등록'}
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
        <div className="grid grid-cols-2 gap-6">
          {/* 상품 정보 입력 섹션 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">품목명</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">규격</label>
              <input
                type="text"
                name="standard"
                value={formData.standard}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">입고단가</label>
              <input
                type="number"
                name="inboundPrice"
                value={formData.inboundPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">출고단가</label>
              <input
                type="number"
                name="outboundPrice"
                value={formData.outboundPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

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
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {product ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}; 
import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Product } from '../../../types/product';

interface ProductDetailTemplateProps {
  product?: Product;
  onBack?: () => void;
}

interface ProductDetailForm {
  name: string;
  quantity: string;
  grade: string;
  stock: number;
  purchasePrice: number;
  sellingPrice: number;
  description: string;
}

export const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({ product, onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductDetailForm>({
    name: '',
    quantity: '',
    grade: '',
    stock: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        quantity: product.quantity,
        grade: product.grade,
        stock: product.stock,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        description: product.description || ''
      });
    }
  }, [product]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동 후 데이터 전송 구현
    console.log('Form submitted:', { ...formData, image: selectedImage });
  };

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
          {/* 이미지 업로드 섹션 */}
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Selected product" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-center">
                  <Typography variant="titleSmall" color="text-gray-500">
                    클릭하여 이미지 업로드
                  </Typography>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* 상품 정보 입력 섹션 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">수량</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">매입가</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">판매가</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
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
            {product ? '수정' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}; 
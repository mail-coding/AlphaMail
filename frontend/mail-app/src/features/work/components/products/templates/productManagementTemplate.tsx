import React, { useState } from 'react';
import { Product } from '../../../types/product';
import { ProductSearchBar } from '../organisms/productSearchBar';
import { ProductTable } from '../organisms/productTable';

interface ProductManagementTemplateProps {
  onAddProduct?: () => void;
  onProductClick?: (product: Product) => void;
}

export const ProductManagementTemplate: React.FC<ProductManagementTemplateProps> = ({ onAddProduct, onProductClick }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  
  // TODO: API 연동 후 실제 데이터로 교체
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: '익스트림 울트라 명품 조립 PC',
      quantity: '1EA',
      grade: '100',
      stock: 100,
      purchasePrice: 990000,
      sellingPrice: 1100000,
    },
    {
      id: 2,
      name: '인텔 코어 i7-3770K',
      quantity: '20개',
      grade: '100',
      stock: 100,
      purchasePrice: 990000,
      sellingPrice: 1100000,
    },
  ]);

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    // TODO: API 연동 후 검색 기능 구현
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const productsWithSelection = products.map(product => ({
    ...product,
    isSelected: selectedProducts.has(product.id)
  }));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">재고 관리</h1>
        <div className="space-x-2">
          <button 
            onClick={onAddProduct}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            상품 등록
          </button>
          <button className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
            출력
          </button>
          <button className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
            삭제
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <ProductSearchBar
            keyword={keyword}
            onSearch={handleSearch}
          />
          <ProductTable
            products={productsWithSelection}
            onSelectProduct={handleSelectProduct}
            onProductClick={onProductClick}
          />
        </div>
      </div>
    </div>
  );
}; 
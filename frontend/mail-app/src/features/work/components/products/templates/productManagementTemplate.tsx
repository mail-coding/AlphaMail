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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 항목 수
  
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
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // TODO: API 연동 후 페이지 변경 시 데이터 로드
  };

  // 현재 페이지의 데이터만 필터링
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const productsWithSelection = getCurrentPageProducts().map(product => ({
    ...product,
    isSelected: selectedProducts.has(product.id)
  }));

  // 총 페이지 수 계산
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="mb-4">
        <ProductSearchBar
          keyword={keyword}
          onSearch={handleSearch}
        />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={onAddProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              상품 등록
            </button>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                출력
              </button>
              <button className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                삭제
              </button>
            </div>
          </div>
          <ProductTable
            products={productsWithSelection}
            onSelectProduct={handleSelectProduct}
            onProductClick={onProductClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}; 
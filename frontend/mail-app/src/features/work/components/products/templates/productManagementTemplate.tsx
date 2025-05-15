import React from 'react';
import { Product } from '../../../types/product';
import { ProductSearchBar } from '../organisms/productSearchBar';
import { ProductTable } from '../organisms/productTable';
import { ProductDetailTemplate } from './productDetailTemplate';
import { productService } from '../../../services/productService';
import { useProductStore } from '../../../stores/productStore';
import { usePagedProducts } from '../../../hooks/usePagedProducts';
import { useQueryClient } from '@tanstack/react-query';

interface ProductManagementTemplateProps {
  onAddProduct?: () => void;
  onProductClick?: (product: Product) => void;
}

export const ProductManagementTemplate: React.FC<ProductManagementTemplateProps> = ({ 
  onAddProduct,
  onProductClick,
}) => {
  const queryClient = useQueryClient();
  const {
    keyword,
    setKeyword,
    selectedProduct,
    setSelectedProduct,
    selectedProductIds,
    toggleProductSelection,
    setSelectedProductIds
  } = useProductStore();

  const {
    products,
    totalCount,
    pageCount,
    currentPage,
    isLoading,
    error,
    handlePageChange
  } = usePagedProducts();

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (selectedProductIds.size === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (!window.confirm('선택한 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await productService.deleteProducts([...selectedProductIds]);
      setSelectedProductIds(new Set());
      alert('선택한 상품이 삭제되었습니다.');
      
      // 삭제 후 데이터 갱신
      await queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'all'
      });
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  if (selectedProduct && !onProductClick) {
    return (
      <ProductDetailTemplate
        product={selectedProduct}
        onBack={handleBack}
      />
    );
  }

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
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
              >
                삭제
              </button>
            </div>
          </div>
          <ProductTable
            products={products}
            totalCount={totalCount}
            pageCount={pageCount}
            currentPage={currentPage}
            onProductClick={handleProductClick}
            onSelectProduct={toggleProductSelection}
            selectedProductIds={selectedProductIds}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}; 
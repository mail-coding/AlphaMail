import React from 'react';
import { Product } from '../../../types/product';
import { ProductSearchBar } from '../organisms/productSearchBar';
import { ProductTable } from '../organisms/productTable';
import { productService } from '../../../services/productService';
import { useProductStore } from '../../../stores/productStore';
import { usePagedProducts } from '../../../hooks/usePagedProducts';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';
import { toast } from 'react-toastify';

interface ProductManagementTemplateProps {
  onAddProduct?: () => void;
}

export const ProductManagementTemplate: React.FC<ProductManagementTemplateProps> = ({ 
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    keyword,
    setKeyword,
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
    navigate(`/work/products/${product.id}`);
  };

  const handleAddProduct = () => {
    navigate('/work/products/new');
  };

  const handleDelete = async () => {
    if (selectedProductIds.size === 0) {
      toast.error('삭제할 상품을 선택해주세요.');
      return;
    }

    if (!window.confirm('선택한 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await productService.deleteProducts([...selectedProductIds]);
      setSelectedProductIds(new Set());
      toast.success('선택한 상품이 삭제되었습니다.');
      
      await queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'all'
      });
      await queryClient.invalidateQueries({ 
        queryKey: ['productDetail'],
        refetchType: 'all'
      });
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      toast.error('상품 삭제에 실패했습니다.');
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

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
            <Button
              onClick={handleAddProduct}
              variant="text"
              size="large"
              className="flex items-baseline gap-2 p-0 bg-transparent shadow-none border-none text-black font-bold text-xl hover:bg-transparent hover:text-black active:bg-transparent"
            >
              <span className="text-2xl font-bold leading-none relative -top-[-1px] text-black">+</span>
              <Typography variant="titleSmall" className="leading-none">재고 등록하기</Typography>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                variant="text"
                size="small"
                className="min-w-[110px] h-[40px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
              >
                <Typography variant="titleSmall">삭제</Typography>
              </Button>
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
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}; 
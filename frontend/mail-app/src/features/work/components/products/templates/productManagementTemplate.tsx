import React, { useState } from 'react';
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
import { showToast } from '@/shared/components/atoms/toast';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { WarningModal } from '@/shared/components/warningModal';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      showToast('삭제할 상품을 선택해주세요.', 'error');
      return;
    }

    // 모달 열기
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 처리 함수
  const confirmDelete = async () => {
    try {
      await productService.deleteProducts([...selectedProductIds]);
      setSelectedProductIds(new Set());
      showToast('선택한 상품이 삭제되었습니다.', 'success');
      
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
      showToast('상품 삭제에 실패했습니다.', 'error');
    } finally {
      // 모달 닫기
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
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
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-4 text-red-500">에러가 발생했습니다.</div>;

  return (
    <>
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
              onClick={handleAddProduct}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg "
              type="button"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E0EBFB]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#4885F9" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </span>
              <Typography variant="titleSmall">재고 등록</Typography>
            </button>

              <div className="flex gap-2">
                <Button
                  onClick={handleDelete}
                  variant="text"
                  size="small"
                  className="min-w-[80px] h-[30px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
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

      {/* 삭제 확인 모달 추가 */}
      <WarningModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-500" />}
        title={<Typography variant="titleMedium">상품 삭제</Typography>}
        description={
          <Typography variant="body">
            선택한 {selectedProductIds.size}개의 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Typography>
        }
        actions={
          <>
            <Button
              variant="text"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              삭제
            </Button>
          </>
        }
      />
    </>
  );
}; 
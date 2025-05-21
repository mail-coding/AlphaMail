import React from 'react';
import { Product } from '../../../types/product';
import ProductSearchBar from '../molecules/productSearchBar';
import ProductSelectTable from '../organisms/productSelectTable';
import { useProductSelect } from '../../../hooks/useProductSelect';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';

interface ProductSelectTemplateProps {
  isOpen: boolean;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

const ProductSelectTemplate: React.FC<ProductSelectTemplateProps> = ({
  isOpen, onSelect, onClose
}) => {
  const {
    products = [],
    searchKeyword,
    selectedId,
    isLoading,
    error,
    handleSearch,
    handleSelect,
    getSelectedProduct,
  } = useProductSelect();

  if (!isOpen) return null;

  const handleConfirm = () => {
    const product = getSelectedProduct();
    if (product) onSelect(product);
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-4">
          <div className="text-red-500">{error}</div>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-[800px] h-[600px] mx-4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <Typography variant="titleMedium">품목 추가</Typography>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          <ProductSearchBar keyword={searchKeyword} onSearch={handleSearch} />
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <ProductSelectTable
              products={products}
              selectedId={selectedId}
              onSelect={handleSelect}
              isLoading={isLoading}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="primary"
              disabled={selectedId === null || isLoading}
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
            >
              선택
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectTemplate; 
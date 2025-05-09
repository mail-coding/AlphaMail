import React, { useState } from 'react';
import { Product } from '../../../features/work/types/product';
import ProductSelectTemplate from '../../../features/work/components/products/templates/productSelectTemplate';

interface ProductInputProps {
  value: string;
  onChange: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

const ProductInput: React.FC<ProductInputProps> = ({
  value,
  onChange,
  placeholder = '품목을 검색하세요',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (product: Product) => {
    onChange(product);
    setIsModalOpen(false);
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onClick={() => setIsModalOpen(true)}
        readOnly
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md shadow-sm p-2 cursor-pointer hover:bg-gray-50 ${className}`}
      />
      <ProductSelectTemplate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
};

export default ProductInput; 
import React, { useState } from 'react';
import { Product } from '../../../features/work/types/product';
import ProductSelectTemplate from '../../../features/work/components/products/templates/productSelectTemplate';
import { Typography } from '@/shared/components/atoms/Typography';

interface ProductInputProps {
  value: string;
  onChange: (product: Product) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const ProductInput: React.FC<ProductInputProps> = ({
  value,
  onChange,
  placeholder = '품목을 검색하세요',
  className = '',
  label,
  required,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (product: Product) => {
    onChange(product);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-1">
      {label && (
        <Typography variant="body" className="block text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Typography>
      )}
      <input
        type="text"
        value={value}
        onClick={() => setIsModalOpen(true)}
        readOnly
        placeholder={placeholder}
        className={`w-full border border-gray-300 shadow-sm p-2 cursor-pointer hover:bg-gray-50 font-pretendard text-xs ${className}`}
      />
      <ProductSelectTemplate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default ProductInput;
import React from 'react';
import { QuoteProduct } from '../../../types/quote';
import { Product } from '../../../types/product';
import ProductInput from '@/shared/components/atoms/productInput';

interface QuoteProductTableRowProps {
  index: number;
  product: QuoteProduct;
  onProductChange: (index: number, field: keyof QuoteProduct, value: string | number) => void;
  onRemoveProduct: (index: number) => void;
  onProductSelect: (product: Product) => void;
}

export const QuoteProductTableRow: React.FC<QuoteProductTableRowProps> = ({
  index,
  product,
  onProductChange,
  onRemoveProduct,
  onProductSelect,
}) => {
  const taxAmount = Math.floor((product.count || 0) * (product.price || 0) * 0.1);
  const supplyAmount = Math.floor((product.count || 0) * (product.price || 0) * 1.1);

  return (
    <tr>
      <td className="border border-[#E5E5E5] bg-white text-center align-middle h-[40px] w-[40px]">
        <button
          type="button"
          onClick={() => onRemoveProduct(index)}
          className="w-6 h-6 flex items-center justify-center bg-[#3E99C6] text-white hover:bg-blue-600"
          aria-label="행 삭제"
        >
          <span className="text-base font-bold leading-none">－</span>
        </button>
      </td>
      <td className="border border-[#E5E5E5] bg-white text-center align-middle h-[40px] w-[40px]">{index + 1}</td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <ProductInput
          value={product.name}
          onChange={onProductSelect}
          className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
        />
      </td>
      <td className="border border-[#E5E5E5] bg-gray-50 px-2">
        <input 
          value={product.standard} 
          readOnly
          className="w-full h-[32px] px-2 border border-gray-300 bg-gray-100 text-sm focus:outline-none"
        />
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <input 
          type="number" 
          value={product.count} 
          onChange={e => onProductChange(index, 'count', Number(e.target.value))} 
          className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm text-right focus:outline-none"
        />
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <div className="flex items-center">
          <input 
            type="number" 
            value={product.price} 
            onChange={e => onProductChange(index, 'price', Number(e.target.value))} 
            className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm text-right focus:outline-none"
          />
          <span className="ml-1 text-gray-500 whitespace-nowrap">원</span>
        </div>
      </td>
      <td className="border border-[#E5E5E5] bg-gray-50 px-2">
        <div className="flex items-center">
          <input 
            type="number" 
            value={taxAmount} 
            readOnly
            className="w-full h-[32px] px-2 border border-gray-300 bg-gray-100 text-sm text-right focus:outline-none"
          />
          <span className="ml-1 text-gray-500 whitespace-nowrap">원</span>
        </div>
      </td>
      <td className="border border-[#E5E5E5] bg-gray-50 px-2">
        <div className="flex items-center">
          <input 
            type="number" 
            value={supplyAmount} 
            readOnly
            className="w-full h-[32px] px-2 border border-gray-300 bg-gray-100 text-sm text-right focus:outline-none"
          />
          <span className="ml-1 text-gray-500 whitespace-nowrap">원</span>
        </div>
      </td>
    </tr>
  );
}; 
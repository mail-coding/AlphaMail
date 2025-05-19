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
          className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600"
          aria-label="행 삭제"
        >
          <span className="text-lg font-bold">－</span>
        </button>
      </td>
      <td className="border border-[#E5E5E5] bg-[#F9F9F9] text-center align-middle h-[40px] w-[40px]">{index + 1}</td>
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
          className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm focus:outline-none"
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
        <input 
          type="number" 
          value={product.price} 
          onChange={e => onProductChange(index, 'price', Number(e.target.value))} 
          className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm text-right focus:outline-none"
        />
        <span className="ml-1 text-gray-500">원</span>
      </td>
      <td className="border border-[#E5E5E5] bg-gray-50 px-2">
        <input 
          type="number" 
          value={taxAmount} 
          readOnly
          className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm text-right focus:outline-none"
        />
        <span className="ml-1 text-gray-500">원</span>
      </td>
      <td className="border border-[#E5E5E5] bg-gray-50 px-2">
        <input 
          type="number" 
          value={supplyAmount} 
          readOnly
          className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm text-right focus:outline-none"
        />
        <span className="ml-1 text-gray-500">원</span>
      </td>
      <td className="border border-[#E5E5E5] bg-gray-50 px-2 text-right align-middle">
        {product.price ? product.price.toLocaleString() : ''}원
      </td>
    </tr>
  );
}; 
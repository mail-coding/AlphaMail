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
  // 공급가액 계산 (수량 * 단가)
  const handleQuantityOrPriceChange = (field: 'count' | 'price', value: number) => {
    onProductChange(index, field, value);
  };

  const supplyAmount = product.count * product.price;
  const taxAmount = Math.round(supplyAmount * 0.1); // 10% 세액

  return (
    <tr>
      <td className="p-4">{index + 1}</td>
      <td className="p-4">
        <ProductInput
          value={product.name}
          onChange={onProductSelect}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="p-4">
        <input
          type="text"
          value={product.standard}
          onChange={(e) => onProductChange(index, 'standard', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="p-4">
        <input
          type="number"
          value={product.count}
          onChange={(e) => handleQuantityOrPriceChange('count', Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="p-4">
        <input
          type="number"
          value={product.price}
          onChange={(e) => handleQuantityOrPriceChange('price', Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
      <td className="p-4 text-right">
        {taxAmount.toLocaleString()}원
      </td>
      <td className="p-4 text-right">
        {supplyAmount.toLocaleString()}원
      </td>
      <td className="p-4 text-center">
        <button
          type="button"
          onClick={() => onRemoveProduct(index)}
          className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}; 
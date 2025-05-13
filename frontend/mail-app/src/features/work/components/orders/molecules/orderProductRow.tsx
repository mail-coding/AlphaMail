import React from 'react';
import { OrderProduct } from '../../../types/order';
import { Product } from '../../../types/product';
import ProductInput from '../../../../../shared/components/atoms/productInput';

interface OrderProductRowProps {
  index: number;
  product: OrderProduct;
  onProductChange: (index: number, field: keyof OrderProduct, value: string | number) => void;
  onRemoveProduct: (index: number) => void;
  onProductSelect: (product: Product) => void;
}

const OrderProductRow: React.FC<OrderProductRowProps> = ({
  index,
  product,
  onProductChange,
  onRemoveProduct,
  onProductSelect,
}) => {
  return (
    <tr>
      <td className="p-2 text-center">{index + 1}</td>
      <td className="p-2">
        <ProductInput
          value={product.name}
          onChange={onProductSelect}
          className="border p-1 rounded"
        />
      </td>
      <td className="p-2">
        <input 
          value={product.standard} 
          onChange={e => onProductChange(index, 'standard', e.target.value)} 
          className="border p-1 rounded w-full" 
        />
      </td>
      <td className="p-2">
        <input 
          type="number" 
          value={product.count} 
          onChange={e => onProductChange(index, 'count', Number(e.target.value))} 
          className="border p-1 rounded w-full" 
        />
      </td>
      <td className="p-2">
        <input 
          type="number" 
          value={product.price} 
          onChange={e => onProductChange(index, 'price', Number(e.target.value))} 
          className="border p-1 rounded w-full" 
        />
      </td>
      <td className="p-2">
        <input 
          type="number" 
          value={product.tax_amount} 
          onChange={e => onProductChange(index, 'tax_amount', Number(e.target.value))} 
          className="border p-1 rounded w-full" 
        />
      </td>
      <td className="p-2">
        <input 
          type="number" 
          value={product.supply_amount} 
          onChange={e => onProductChange(index, 'supply_amount', Number(e.target.value))} 
          className="border p-1 rounded w-full" 
        />
      </td>
      <td className="p-2 text-right">{product.price}원</td>
      <td className="p-2 text-center">
        <button 
          type="button" 
          onClick={() => onRemoveProduct(index)} 
          className="text-red-500 hover:underline"
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

export default OrderProductRow; 
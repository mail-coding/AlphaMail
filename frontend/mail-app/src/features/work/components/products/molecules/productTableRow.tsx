import React from 'react';
import { Product } from '../../../types/product';

interface ProductTableRowProps {
  product: Product;
  onSelect: (id: number) => void;
  onProductClick?: (product: Product) => void;
  sequenceNumber: number;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onSelect,
  onProductClick,
  sequenceNumber
}) => {
  console.log('Product in Row:', product);

  return (
    <tr className={`border-b hover:bg-gray-50 ${product.isSelected ? 'bg-blue-50' : ''}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={product.isSelected}
          onChange={() => onSelect(product.id)}
          className="rounded border-gray-300"
        />
      </td>
      <td className="p-4">{sequenceNumber}</td>
      <td className="p-4">
        {onProductClick ? (
          <button
            onClick={() => onProductClick(product)}
            className="text-left hover:text-blue-600 hover:underline"
          >
            {product.name}
          </button>
        ) : (
          <span>{product.name}</span>
        )}
      </td>
      <td className="p-4 text-center">{product.standard}</td>
      <td className="p-4 text-center">{product.stock}</td>
      <td className="p-4 text-right">{product.inboundPrice.toLocaleString()}원</td>
      <td className="p-4 text-right">{product.outboundPrice.toLocaleString()}원</td>
    </tr>
  );
}; 
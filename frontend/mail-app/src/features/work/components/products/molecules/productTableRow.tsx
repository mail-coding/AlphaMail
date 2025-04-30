import React from 'react';
import { Product } from '../../../types/product';

interface ProductTableRowProps {
  product: Product;
  onSelect: (id: number) => void;
  onProductClick?: (product: Product) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onSelect,
  onProductClick,
}) => {
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
      <td className="p-4">{product.id}</td>
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
      <td className="p-4 text-center">{product.quantity}</td>
      <td className="p-4 text-center">{product.grade}</td>
      <td className="p-4 text-center">{product.stock}</td>
      <td className="p-4 text-right">{product.purchasePrice.toLocaleString()}/원</td>
      <td className="p-4 text-right">{product.sellingPrice.toLocaleString()}/원</td>
    </tr>
  );
}; 
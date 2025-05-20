import React from 'react';
import { Product } from '../../../types/product';
import { Typography } from '@/shared/components/atoms/Typography';

interface ProductTableRowProps {
  product: Product;
  onSelect: (id: number) => void;
  onProductClick?: (product: Product) => void;
  sequenceNumber: string;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onSelect,
  onProductClick,
  sequenceNumber
}) => {
  return (
    <tr 
      className="border-t hover:bg-gray-50 cursor-pointer"
      onClick={() => onProductClick?.(product)}
    >
      <td className="p-2 text-center border-r border-gray-200" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={product.isSelected}
          onChange={() => onSelect(product.id)}
          className="rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {sequenceNumber}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {product.name}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {product.standard}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {product.stock}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {product.inboundPrice.toLocaleString()}원
        </Typography>
      </td>
      <td className="p-2 text-center">
        <Typography variant="body">
          {product.outboundPrice.toLocaleString()}원
        </Typography>
      </td>
    </tr>
  );
}; 
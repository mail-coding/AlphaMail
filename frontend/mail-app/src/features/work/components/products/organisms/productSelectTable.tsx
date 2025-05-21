import React from 'react';
import { Product } from '../../../types/product';
import { Typography } from '@/shared/components/atoms/Typography';
import ProductSelectTableRow from '../molecules/productSelectTableRow';
import { Button } from '@/shared/components/atoms/button';

interface ProductSelectTableProps {
  products: Product[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  isLoading?: boolean;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

const ProductSelectTable: React.FC<ProductSelectTableProps> = ({
  products,
  selectedId,
  onSelect,
  isLoading = false,
  page = 1,
  pageCount = 1,
  onPageChange = () => {},
}) => {
  return (
    <div className="relative h-full flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="border-t-2 border-gray-400 rounded-t-md"></div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-0 w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 first:border-l-0 last:border-r-0">
                
              </th>
              <th scope="col" className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                <Typography variant="body">품목</Typography>
              </th>
              <th scope="col" className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                <Typography variant="body">규격</Typography>
              </th>
              <th scope="col" className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                <Typography variant="body">재고</Typography>
              </th>
              <th scope="col" className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                <Typography variant="body">입고단가</Typography>
              </th>
              <th scope="col" className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Typography variant="body">출고단가</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <ProductSelectTableRow
                key={product.id}
                product={product}
                checked={selectedId === product.id}
                onSelect={onSelect}
                withColBorder
                tdPadding="px-2 py-2"
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-2 mb-1">
        <Button
          type="button"
          variant="ghost"
          size="small"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          &lt;
        </Button>
        {[...Array(pageCount)].map((_, i) => (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="small"
            onClick={() => onPageChange(i + 1)}
            className={page === i + 1 ? 'font-bold underline' : ''}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="small"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default ProductSelectTable; 
import React from 'react';
import { Product } from '../../../types/product';
import { ProductTableRow } from '../molecules/productTableRow';
import { Pagination } from '../molecules/pagination';

interface ProductTableProps {
  products: Product[];
  onSelectProduct: (id: number) => void;
  onProductClick?: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSelectProduct,
  onProductClick,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">선택</th>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">품목명</th>
              <th className="p-4 text-center">수량</th>
              <th className="p-4 text-center">등급</th>
              <th className="p-4 text-center">재고</th>
              <th className="p-4 text-right">매입가</th>
              <th className="p-4 text-right">판매가</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onProductClick={onProductClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}; 
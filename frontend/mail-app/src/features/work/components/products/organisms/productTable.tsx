import { Product } from '../../../types/product';
import { ProductTableRow } from '../molecules/productTableRow';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';
import { Spinner } from '@/shared/components/atoms/spinner';

interface ProductTableProps {
  products: Product[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  onProductClick?: (product: Product) => void;
  onSelectProduct?: (id: number) => void;
  selectedProductIds?: Set<number>;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({ 
  products,
  totalCount,
  pageCount,
  currentPage,
  onProductClick,
  onSelectProduct,
  selectedProductIds = new Set(),
  onPageChange,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner size="large" />
      </div>
    );
  }

  if (!Array.isArray(products)) {
    console.error('Products is not an array:', products);
    return <div>데이터 형식이 올바르지 않습니다.</div>;
  }

  return (
    <div>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border-r border-gray-200">
              <input
                type="checkbox"
                checked={products.length > 0 && products.every((product) => selectedProductIds.has(product.id))}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  const currentPageProductIds = products.map(product => product.id);
                  
                  currentPageProductIds.forEach(productId => {
                    if (selectedProductIds.has(productId) !== isChecked) {
                      onSelectProduct?.(productId);
                    }
                  });
                }}
                className="rounded border-gray-300"
              />
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body">순번</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body">품목명</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body">규격</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body">재고</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body">매입가</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body">판매가</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, idx) => (
              <ProductTableRow
                key={product.id}
                product={{
                  ...product,
                  isSelected: selectedProductIds.has(product.id)
                }}
                sequenceNumber={String(idx + 1).padStart(4, '0')}
                onSelect={onSelectProduct || (() => {})}
                onProductClick={onProductClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center">
                <Typography variant="body" color="text-gray-500">
                  상품이 없습니다.
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </Button>
        {[...Array(pageCount)].map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="small"
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? 'font-bold underline' : ''}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </Button>
        <Typography variant="body" className="ml-4">
          총 {totalCount}개
        </Typography>
      </div>
    </div>
  );
}; 
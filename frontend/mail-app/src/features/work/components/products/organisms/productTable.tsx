import { Product } from '../../../types/product';
import { ProductTableRow } from '../molecules/productTableRow';
import { Pagination } from '../molecules/pagination';

interface ProductTableProps {
  products: Product[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  onProductClick?: (product: Product) => void;
  onSelectProduct?: (id: number) => void;
  selectedProductIds?: Set<number>;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ 
  products,
  totalCount,
  pageCount,
  currentPage,
  onProductClick,
  onSelectProduct,
  selectedProductIds = new Set(),
  onPageChange
}) => {
  if (!Array.isArray(products)) {
    console.error('Products is not an array:', products);
    return <div>데이터 형식이 올바르지 않습니다.</div>;
  }

  // 페이지당 상품 수 (기본값 10)
  const itemsPerPage = 10;
  // 현재 페이지의 시작 인덱스
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div>
      <div className="mb-4 flex justify-end items-center">
        <div className="text-sm text-gray-600">
          총 {totalCount}개의 상품
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">선택</th>
              <th className="p-4 text-left">순번</th>
              <th className="p-4 text-left">품목명</th>
              <th className="p-4 text-center">규격</th>
              <th className="p-4 text-center">재고</th>
              <th className="p-4 text-right">매입가</th>
              <th className="p-4 text-right">판매가</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => {
                // 역순 순번 계산 (전체 개수 - (현재 페이지 시작 인덱스 + 현재 인덱스))
                const sequenceNumber = totalCount - (startIndex + index);
                console.log('Rendering product:', product);
                return (
                  <ProductTableRow
                    key={product.id}
                    product={{
                      ...product,
                      isSelected: selectedProductIds.has(product.id)
                    }}
                    sequenceNumber={sequenceNumber}
                    onSelect={onSelectProduct || (() => {})}
                    onProductClick={onProductClick}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}; 
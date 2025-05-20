import { Typography } from '@/shared/components/atoms/Typography';
import React from 'react';
import { Product } from '../../../types/product';
import { QuoteProduct } from '../../../types/quote';
import { QuoteProductTableRow } from '../molecules/quoteProductTableRow';

interface QuoteProductTableProps {
  products: QuoteProduct[];
  onProductChange: (index: number, field: keyof QuoteProduct, value: string | number) => void;
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
  availableProducts: Product[];
  onProductSelect: (product: Product) => void;
}

export const QuoteProductTable: React.FC<QuoteProductTableProps> = ({
  products,
  onProductChange,
  onAddProduct,
  onRemoveProduct,
}) => {

  return (
    <div className="bg-white rounded shadow p-4">
      <table className="min-w-full mb-2 border-separate border-spacing-0">
        <colgroup>
          <col style={{ width: '48px' }} />
          <col style={{ width: '48px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '80px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '120px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
        </colgroup>
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 w-[40px] text-center align-middle">
              <button
                type="button"
                onClick={onAddProduct}
                className="w-6 h-6 flex items-center justify-center bg-[#3E99C6] text-white hover:bg-blue-600"
                aria-label="행 추가"
              >
                <span className="text-base font-bold">＋</span>
              </button>
            </th>
            <th className="p-2"><Typography variant="body">순번</Typography></th>
            <th className="p-2"><Typography variant="body">품목</Typography></th>
            <th className="p-2"><Typography variant="body">규격</Typography></th>
            <th className="p-2"><Typography variant="body">수량</Typography></th>
            <th className="p-2"><Typography variant="body">단가</Typography></th>
            <th className="p-2"><Typography variant="body">세액</Typography></th>
            <th className="p-2"><Typography variant="body">공급가액</Typography></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <QuoteProductTableRow
              key={index}
              index={index}
              product={product}
              onProductChange={onProductChange}
              onRemoveProduct={onRemoveProduct}
              onProductSelect={(product) => {
                onProductChange(index, 'id', product.id);
                onProductChange(index, 'name', product.name);
                onProductChange(index, 'standard', product.standard || '');
                onProductChange(index, 'price', product.outboundPrice || 0);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}; 
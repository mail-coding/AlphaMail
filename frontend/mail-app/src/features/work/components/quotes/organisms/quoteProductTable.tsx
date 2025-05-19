import React from 'react';
import { QuoteProduct } from '../../../types/quote';
import { Product } from '../../../types/product';
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
  const totalSupplyAmount = products.reduce((sum, product) => sum + product.price, 0);
  const totalTaxAmount = products.reduce((sum, product) => sum + product.price * 0.1, 0);
  const totalAmount = products.reduce((sum, product) => sum + product.price * 1.1, 0);

  return (
    <div className="bg-white rounded shadow p-4">
      <table className="min-w-full mb-2 border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 w-[40px] text-center align-middle">
              <button
                type="button"
                onClick={onAddProduct}
                className="w-7 h-7 flex items-center justify-center bg-[#3E99C6] text-white rounded hover:bg-blue-600"
                aria-label="행 추가"
              >
                <span className="text-lg font-bold">＋</span>
              </button>
            </th>
            <th className="p-2">순번</th>
            <th className="p-2">품목</th>
            <th className="p-2">규격</th>
            <th className="p-2">수량</th>
            <th className="p-2">단가</th>
            <th className="p-2">세액</th>
            <th className="p-2">공급가액</th>
            <th className="p-2">금액</th>
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
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan={5} className="p-4 text-right font-medium">
              합계
            </td>
            <td className="p-4 text-right font-medium">
              {totalTaxAmount.toLocaleString()}원
            </td>
            <td className="p-4 text-right font-medium">
              {totalSupplyAmount.toLocaleString()}원
            </td>
            <td className="p-4 text-right font-medium">
              {totalAmount.toLocaleString()}원
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}; 
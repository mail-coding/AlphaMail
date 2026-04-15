import React from 'react';
import { Product } from '../../../types/product';
import OrderProductRow from '../molecules/orderProductRow';
import { useOrderStore } from '../../../stores/orderStore';
import { Typography } from '@/shared/components/atoms/Typography';

const OrderProductTable: React.FC = () => {
  const { formData, updateProduct, addProduct, removeProduct } = useOrderStore();

  if (!formData) {
    return null;
  }

  const handleProductSelect = async (index: number, product: Product) => {
    try {
      updateProduct(index, 'id', product.id);
      updateProduct(index, 'name', product.name);
      updateProduct(index, 'standard', product.standard || '');
      updateProduct(index, 'price', product.outboundPrice || 0);
    } catch (error) {
      console.error('제품 정보 업데이트 실패:', error);
    }
  };

  return (
    <div className="bg-white rounded  p-4 text-[14px]">
      <table className="min-w-full mb-2 border-spacing-0 text-[14px]">
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
        <thead className="bg-gray-100 text-[14px]">
          <tr>
            <th className="p-2 w-[40px] text-center align-middle">
              <button
                type="button"
                onClick={addProduct}
                className="pl-2 w-6 h-6   text-[#4885F9] rounded-md  flex items-center justify-center hover:text-gray-500"
                aria-label="행 추가"
              >
                <span className="text-lg font-bold">＋</span>
              </button>
            </th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">순번</Typography></th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">품목</Typography></th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">규격</Typography></th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">수량</Typography></th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">단가</Typography></th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">세액</Typography></th>
            <th className="p-2"><Typography variant="body" className="text-[14px]">공급가액</Typography></th>
          </tr>
        </thead>
        <tbody>
          {formData.products.map((product, idx) => (
            <OrderProductRow
              key={idx}
              index={idx}
              product={product}
              onProductChange={updateProduct}
              onRemoveProduct={removeProduct}
              onProductSelect={(product) => handleProductSelect(idx, product)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderProductTable; 
import React from 'react';
import { Product } from '../../../types/product';
import OrderProductRow from '../molecules/orderProductRow';
import { useOrderStore } from '../../../stores/orderStore';

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
    <div className="bg-white rounded shadow p-4">
      <table className="min-w-full mb-2 border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 w-[40px] text-center align-middle">
              <button
                type="button"
                onClick={addProduct}
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
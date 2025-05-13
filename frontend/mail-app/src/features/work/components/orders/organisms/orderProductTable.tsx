import React from 'react';
import { Product } from '../../../types/product';
import OrderProductRow from '../molecules/orderProductRow';
import { useOrderStore } from '../../../stores/orderStore';

const OrderProductTable: React.FC = () => {
  const { formData, updateProduct, addProduct, removeProduct } = useOrderStore();

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
      <table className="min-w-full mb-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">순번</th>
            <th className="p-2">품목</th>
            <th className="p-2">규격</th>
            <th className="p-2">수량</th>
            <th className="p-2">단가</th>
            <th className="p-2">세액</th>
            <th className="p-2">공급가액</th>
            <th className="p-2">금액</th>
            <th className="p-2">삭제</th>
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
      <button
        type="button"
        onClick={addProduct}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        행 추가
      </button>
    </div>
  );
};

export default OrderProductTable; 
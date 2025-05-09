import React, { useState } from 'react';
import { OrderDetail, OrderProduct } from '../../../types/order';
import OrderBasicInfoForm from '../organisms/orderBasicInfoForm';
import OrderProductTable from '../organisms/orderProductTable';
import { orderService } from '../../../services/orderService';

interface OrderDetailTemplateProps {
  order: OrderDetail | null;
  onBack: () => void;
  onSave: (orderData: OrderDetail) => void;
}

const OrderDetailTemplate: React.FC<OrderDetailTemplateProps> = ({ order, onBack, onSave }) => {
  const [formData, setFormData] = useState<OrderDetail>(
    order || {
      order_no: '',
      date: '',
      is_inbound: false,
      manager: '',
      client_name: '',
      business_no: '',
      representative: '',
      business_type: '',
      business_category: '',
      client_manager: '',
      client_contact: '',
      payment_condition: '',
      due_date: '',
      address: '',
      products: [
        {
          name: '',
          standard: '',
          quantity: 0,
          unit_price: 0,
          tax_amount: 0,
          supply_amount: 0,
          amount: 0,
        },
      ],
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProductChange = (index: number, field: keyof OrderProduct, value: string | number) => {
    setFormData((prev) => {
      const newProducts = [...prev.products];
      newProducts[index] = {
        ...newProducts[index],
        [field]: value,
      };
      if (field === 'quantity' || field === 'unit_price') {
        newProducts[index].amount = newProducts[index].quantity * newProducts[index].unit_price;
      }
      return {
        ...prev,
        products: newProducts,
      };
    });
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          name: '',
          standard: '',
          quantity: 0,
          unit_price: 0,
          tax_amount: 0,
          supply_amount: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (order) {
        await orderService.updateOrder(Number(order.order_no), formData);
      } else {
        await orderService.createOrder(formData);
      }
      onSave(formData);
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('발주서 저장에 실패했습니다.');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{order ? '발주서 수정' : '발주서 등록'}</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          뒤로가기
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <OrderBasicInfoForm formData={formData} onInputChange={handleInputChange} />
        <OrderProductTable
          products={formData.products}
          onProductChange={handleProductChange}
          onAddProduct={addProduct}
          onRemoveProduct={removeProduct}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {order ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderDetailTemplate; 
import React, { useEffect } from 'react';
import { OrderDetail } from '../../../types/order';
import OrderBasicInfoForm from '../organisms/orderBasicInfoForm';
import OrderProductTable from '../organisms/orderProductTable';
import { orderService } from '../../../services/orderService';
import { useOrderStore } from '../../../stores/orderStore';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useOrderDetail } from '../../../hooks/useOrderDetail';
import { Spinner } from '@/shared/components/atoms/spinner';

interface OrderDetailTemplateProps {
  order: OrderDetail | null;
  onBack: () => void;
  onSave: (orderData: OrderDetail) => void;
}

const OrderDetailTemplate: React.FC<OrderDetailTemplateProps> = ({ order, onBack, onSave }) => {
  const { formData, setFormData } = useOrderStore();
  const { data: userInfo } = useUserInfo();
  const { data: orderDetail, isLoading } = useOrderDetail(order?.id || null);

  useEffect(() => {
    if (orderDetail) {
      setFormData(orderDetail);
    } else if (order) {
      setFormData(order);
    }
  }, [order, orderDetail, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userInfo) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      if (order) {
        await orderService.updateOrder(formData, userInfo.id, userInfo.companyId, userInfo.groupId);
      } else {
        await orderService.createOrder(formData, userInfo.id, userInfo.companyId, userInfo.groupId);
      }
      onSave(formData);
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('발주서 저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

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
        <OrderBasicInfoForm />
        <OrderProductTable />
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
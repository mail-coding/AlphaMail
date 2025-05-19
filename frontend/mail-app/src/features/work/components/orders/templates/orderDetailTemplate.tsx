import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderBasicInfoForm from '../organisms/orderBasicInfoForm';
import OrderProductTable from '../organisms/orderProductTable';
import { orderService } from '../../../services/orderService';
import { useOrderStore } from '../../../stores/orderStore';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useOrderDetail } from '../../../hooks/useOrderDetail';
import { Spinner } from '@/shared/components/atoms/spinner';
import { PdfButton } from './orderDocumentTemplate';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';

const OrderDetailTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, setFormData } = useOrderStore();
  const { data: userInfo } = useUserInfo();
  const { data: orderDetail, isLoading } = useOrderDetail(id !== 'new' ? Number(id) : null);

  useEffect(() => {
    if (id === 'new') {
      setFormData({
        id: 0,
        orderNo: '',
        createdAt: new Date(),
        userName: '',
        userId: 0,
        groupId: 0,
        groupName: '',
        clientId: 0,
        clientName: '',
        licenseNumber: '',
        representative: '',
        businessType: '',
        businessItem: '',
        manager: '',
        managerNumber: '',
        paymentTerm: '',
        deliverAt: new Date(),
        shippingAddress: '',
        products: [],
        updatedAt: new Date(),
      });
    } else if (orderDetail) {
      setFormData(orderDetail);
    }
  }, [id, orderDetail, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userInfo) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      if (!formData) {
        throw new Error('발주서 데이터가 없습니다.');
      }

      if (id && id !== 'new') {
        await orderService.updateOrder(formData, userInfo.id, userInfo.companyId, userInfo.groupId);
      } else {
        await orderService.createOrder(formData, userInfo.id, userInfo.companyId, userInfo.groupId);
      }
      navigate('/work/orders');
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('발주서 저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate('/work/orders');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  const showPdfButton = id && id !== 'new';

  return (
    <div className="p-8 bg-white rounded shadow max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Typography variant="titleSmall">
          발주서 {id && id !== 'new' ? '수정' : '등록'}
        </Typography>
        <div className="flex space-x-2">
          {showPdfButton && <PdfButton orderId={Number(id)} />}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <OrderBasicInfoForm />
        <OrderProductTable />
        <div className="flex justify-end space-x-2 mt-8">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={handleCancel}
          >
            <Typography variant="titleSmall" className="text-white">취소</Typography>
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
          >
            <Typography variant="titleSmall" className="text-white">{id && id !== 'new' ? '수정' : '등록'}</Typography>
          </Button>
        </div>
      </form>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
        >
          ← 목록으로
        </button>
      </div>
    </div>
  );
};

export default OrderDetailTemplate; 
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
    if (orderDetail) {
      setFormData(orderDetail);
    }
  }, [orderDetail, setFormData]);

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
        <Typography variant="titleLarge" bold>
          발주서 {id && id !== 'new' ? '수정' : '등록'}
        </Typography>
        <div className="flex space-x-2">
          {showPdfButton && <PdfButton orderId={Number(id)} />}
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="large"
            className="w-[110px] h-[40px]"
          >
            <Typography variant="titleSmall">뒤로가기</Typography>
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <OrderBasicInfoForm />
        <OrderProductTable />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={handleCancel}
            className="w-[110px] h-[40px]"
          >
            <Typography variant="titleSmall">취소</Typography>
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-[110px] h-[40px]"
          >
            <Typography variant="titleSmall">{id && id !== 'new' ? '수정' : '등록'}</Typography>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderDetailTemplate; 
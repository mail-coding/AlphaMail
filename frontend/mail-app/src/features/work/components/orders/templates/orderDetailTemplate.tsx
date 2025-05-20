import React, { useEffect, useRef, useState } from 'react';
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
import { TooltipPortal } from '@/shared/components/atoms/TooltipPortal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQueryClient } from '@tanstack/react-query';

const OrderDetailTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, setFormData } = useOrderStore();
  const { data: userInfo } = useUserInfo();
  const { data: orderDetail, isLoading, error } = useOrderDetail(id !== 'new' ? Number(id) : null);
  const queryClient = useQueryClient();

  const clientNameRef = useRef<HTMLInputElement>(null!);
  const managerRef = useRef<HTMLInputElement>(null!);
  const managerNumberRef = useRef<HTMLInputElement>(null!);
  const paymentTermRef = useRef<HTMLInputElement>(null!);
  const deliverAtRef = useRef<HTMLInputElement>(null!);
  const shippingAddressRef = useRef<HTMLInputElement>(null!);

  const [tooltip, setTooltip] = useState<{
    key: string;
    message: string;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    if (id === 'new') {
      setFormData({
        id: 0,
        orderNo: '',
        createdAt: new Date(),
        userName: userInfo?.name || '',
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
  }, [id, orderDetail, setFormData, userInfo]);

  useEffect(() => {
    if ((error as any)?.response?.status === 404) {
      navigate('/404', { replace: true });
    }
  }, [error, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTooltip(null);

    if (!userInfo) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    if (!formData) {
      throw new Error('발주서 데이터가 없습니다.');
    }

    // ====== 품목 유효성 검사 ======
    if (!formData.products || formData.products.length === 0) {
      toast.error('최소 1개의 품목을 추가해야 합니다.');
      return;
    }
    for (let i = 0; i < formData.products.length; i++) {
      if (!formData.products[i].name || formData.products[i].name.trim() === '') {
        toast.error(`품목 ${i + 1}의 품목명을 입력해주세요.`);
        return;
      }
    }

    // 거래처명 필수
    if (!formData.clientName || formData.clientName.trim() === '') {
      const rect = clientNameRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'clientName',
        message: '거래처명을 입력해주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    // 거래 담당자 10자 이내
    if (formData.manager && formData.manager.length > 10) {
      const rect = managerRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'manager',
        message: '거래 담당자는 10자 이내로 입력해주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    // 거래처 연락처: 비어있거나, phoneInput의 정규식과 일치
    const phoneRegex = /^((010-\d{4}-\d{4})|(01[1|6|7|8|9]-\d{3,4}-\d{4})|(0[2-9]{1,2}-\d{3,4}-\d{4}))$/;
    if (formData.managerNumber && !phoneRegex.test(formData.managerNumber)) {
      const rect = managerNumberRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'managerNumber',
        message: '거래처 연락처 형식이 올바르지 않습니다.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    // 결제조건 20자 이하
    if (formData.paymentTerm && formData.paymentTerm.length > 20) {
      const rect = paymentTermRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'paymentTerm',
        message: '결제조건은 20자 이내로 입력해주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    // 납기일자 필수
    if (!formData.deliverAt) {
      const rect = deliverAtRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'deliverAt',
        message: '납기일자를 선택해주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    // 주소 필수
    if (!formData.shippingAddress || formData.shippingAddress.trim() === '') {
      const rect = shippingAddressRef.current?.getBoundingClientRect();
      if (rect) setTooltip({
        key: 'shippingAddress',
        message: '주소를 입력해주세요.',
        position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 }
      });
      return;
    }
    // ====== 기존 제품 유효성 검사 및 저장 로직 ======
    const MAX_PRODUCT_COUNT = 2000000000;
    const MAX_PRODUCT_PRICE = 9223372036854775807; // PostgreSQL BIGINT MAX

    for (let i = 0; i < formData.products.length; i++) {
      const product = formData.products[i];
      const productNameForAlert = product.name || `품목 ${i + 1}`;

      // 수량 유효성 검사
      if (typeof product.count !== 'number' || product.count < 0) {
        alert(`${productNameForAlert}의 수량은 0 이상의 숫자로 입력해주세요.`);
        return;
      }
      if (product.count > MAX_PRODUCT_COUNT) {
        alert(`${productNameForAlert}의 수량은 ${MAX_PRODUCT_COUNT.toLocaleString()}을 초과할 수 없습니다.`);
        return;
      }

      // 단가 유효성 검사
      if (typeof product.price !== 'number' || product.price < 0) {
        alert(`${productNameForAlert}의 단가는 0 이상의 숫자로 입력해주세요.`);
        return;
      }
      if (product.price > MAX_PRODUCT_PRICE) {
        alert(`${productNameForAlert}의 단가는 ${MAX_PRODUCT_PRICE.toLocaleString()}을 초과할 수 없습니다.`);
        return;
      }
    }

    if (id && id !== 'new') {
      await orderService.updateOrder(formData, userInfo.id, userInfo.companyId, userInfo.groupId);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orderDetail', formData.id] });
    } else {
      await orderService.createOrder(formData, userInfo.id, userInfo.companyId, userInfo.groupId);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
    navigate('/work/orders');
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
        <OrderBasicInfoForm
          clientNameRef={clientNameRef}
          managerRef={managerRef}
          managerNumberRef={managerNumberRef}
          paymentTermRef={paymentTermRef}
          deliverAtRef={deliverAtRef}
          shippingAddressRef={shippingAddressRef}
          onInputFocus={() => setTooltip(null)}
        />
        <OrderProductTable />
        <div className="flex justify-end space-x-2 mt-8">
        <Button
            type="submit"
            variant="primary"
            size="small"
          >
            <Typography variant="titleSmall" className="text-white">{id && id !== 'new' ? '수정' : '등록'}</Typography>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={handleCancel}
          >
            <Typography variant="titleSmall" className="text-white">취소</Typography>
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
      {tooltip && (
        <TooltipPortal position={tooltip.position}>
          <div className="bg-red-500 text-white text-xs rounded px-3 py-1 relative shadow" style={{ transform: 'translateX(-50%) translateY(-100%)' }}>
            {tooltip.message}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500" />
          </div>
        </TooltipPortal>
      )}
    </div>
  );
};

export default OrderDetailTemplate; 
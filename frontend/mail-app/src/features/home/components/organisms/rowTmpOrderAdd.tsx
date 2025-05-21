import React, { useEffect, useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { TmpOrderAddAddress } from '../molecules/tmpOrderAddAddress';
import { TmpOrderAddDate } from '../molecules/tmpOrderAddDate';
import { TmpOrderAddRow } from '../molecules/tmpOrderAddRow';
import { useTmpOrderStore } from '../../stores/useTmpOrderStore';
import { TmpOrderAddClient } from '../molecules/tmpOrderAddClient';
import { useHome } from '../../hooks/useHome';
import { UpdateTemporaryPurchaseOrderRequest } from '../../types/home';
import { useUser } from '@/features/auth/hooks/useUser'; // 추가
import { showToast } from '@/shared/components/atoms/toast';

interface RowTmpOrderAddProps {
  temporaryPurchaseOrderId: number;
}

export const RowTmpOrderAdd: React.FC<RowTmpOrderAddProps> = ({ temporaryPurchaseOrderId }) => {
  const { 
    orderNo, 

    clientName,
    licenseNumber, 
    representative, 
    businessType, 
    businessItem, 
    manager, 
    setManager, 
    managerContact, 
    setManagerContact,
    clientContact,
    setClientContact,
    paymentTerm,
    setPaymentTerm,
    shippingAddress,
    deliverAt,
    setFromApiResponse,
    reset,
    products,
    clientId,
  } = useTmpOrderStore();
  
  const { useTemporaryPurchaseOrder, useUpdateTemporaryPurchaseOrder, useRegisterPurchaseOrder } = useHome();
  const { data: orderDetail, isLoading } = useTemporaryPurchaseOrder(temporaryPurchaseOrderId);
  const updateTemporaryPurchaseOrder = useUpdateTemporaryPurchaseOrder();
  const registerPurchaseOrder = useRegisterPurchaseOrder();
  const { data: user } = useUser(); 
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  useEffect(() => {
    if (orderDetail) {
      setFromApiResponse(orderDetail);
    }
    
    // 컴포넌트가 언마운트될 때 스토어 초기화
    return () => {
      reset();
    };
  }, [orderDetail, setFromApiResponse, reset]);

  const handleTempSave = () => {
    const formattedDeliverAt = deliverAt ? `${deliverAt}T00:00:00` : undefined;
    
    // 임시저장 데이터 구성
    const tempSaveData: UpdateTemporaryPurchaseOrderRequest = {
      // 거래처 정보
      clientName: clientId ? undefined : clientName,
      clientId: clientId || undefined,
      
      // 날짜 및 주소 정보
      deliverAt: formattedDeliverAt,
      shippingAddress: shippingAddress,
      hasShippingAddress: !!shippingAddress,
      
      // 담당자 정보
      manager: managerContact,
      managerNumber: clientContact,
      paymentTerm: paymentTerm,
      
      // 품목 정보
      products: products.map(product => {
        // productId가 있는 경우 무조건 해당 ID를 사용
        if (product.productId) {
          return {
            productId: product.productId,
            count: product.count
          };
        } else {
          return {
            productName: product.productName,
            count: product.count
          };
        }
      })
    };
    
    // 임시저장 API 호출
    updateTemporaryPurchaseOrder.mutate({
      id: temporaryPurchaseOrderId,
      data: tempSaveData
    });
  };

  const handleApply = () => {
    // 유효성 검사
    if (!clientId) {
      setShowValidationErrors(true);
      showToast('거래처를 선택해주세요.', 'error');
      return;
    }
    
    if (!deliverAt) {
      setShowValidationErrors(true);
      showToast('납기일자를 선택해주세요.', 'error');
      return;
    }
    
    if (!products || products.length === 0) {
      setShowValidationErrors(true);
      showToast('최소 1개 이상의 품목을 추가해주세요.', 'error');
      return;
    }
    
    const invalidProducts = products.filter(product => !product.productId);
    if (invalidProducts.length > 0) {
      setShowValidationErrors(true);
      showToast('모든 품목은 검색을 통해 등록해야 합니다.', 'error');
      return;
    }
    
    // 회사 ID (전역 변수 또는 사용자 정보에서 가져옴)
    const companyId = user?.companyId || 1;
    
    // 납기일자 포맷팅
    const formattedDeliverAt = deliverAt ? `${deliverAt}T00:00:00` : '';
    
    // 발주서 등록 데이터 구성
    const registerData = {
      id: temporaryPurchaseOrderId,
      clientId: clientId as number,
      companyId: companyId,
      manager: managerContact || undefined,
      managerNumber: clientContact || undefined,
      paymentTerm: paymentTerm || undefined,
      deliverAt: formattedDeliverAt,
      shippingAddress: shippingAddress || undefined,
      products: products
        .filter(product => product.productId)
        .map(product => ({
          productId: product.productId as number,
          count: product.count
        }))
    };
    
    // 발주서 등록 API 호출
    registerPurchaseOrder.mutate(registerData);
  };
  
  // 필수 입력 필드 오류 메시지 컴포넌트
  const ValidationError = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return (
      <span className="text-red-500 text-xs ml-1">*필수</span>
    );
  };
  
  
  // 입력 필드 높이를 일관되게 유지하기 위한 스타일
  const inputStyle = "h-10";
  
  if (isLoading) {
    return (
      <div className="mt-4 border-t border-gray-200 pt-4 bg-white rounded-sm p-4">
        <Typography variant="titleMedium" className="font-medium mb-4">
          발주서 로딩 중...
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 bg-white rounded-sm p-4">
      <Typography variant="titleMedium" className="font-medium mb-4">
        발주서
      </Typography>
      
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            발주등록번호
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={orderNo} className={`bg-gray-200 ${inputStyle}`} />
        </div>
        
        <div className="col-span-1 flex items-center">
        <Typography variant="caption" className="text-gray-700">
            납기일자
          </Typography>
          {showValidationErrors && !deliverAt && <ValidationError show={true} />}
        </div>
        <div className="col-span-2">
          <div className={`h-10 flex items-center`}>
            <TmpOrderAddDate initialDate={deliverAt} />
          </div>
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            발주담당자
          </Typography>
        </div>
        <div className="col-span-2">
          <Input 
            value={manager} 
            onChange={(e) => setManager(e.target.value)} 
            placeholder="" 
            className={inputStyle}
          />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            결제조건
          </Typography>
        </div>
        <div className="col-span-2">
          <Input 
            value={paymentTerm} 
            onChange={(e) => setPaymentTerm(e.target.value)} 
            placeholder="" 
            className={inputStyle}
          />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            거래처명
          </Typography>
          {showValidationErrors && !clientId && <ValidationError show={true} />}
        </div>
        <div className="col-span-5">
          <div className={`h-10 flex items-center `}>
            <TmpOrderAddClient initialClientName={clientName}/>
          </div>
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            사업자등록번호
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={licenseNumber} className={`bg-gray-200 ${inputStyle}`} placeholder="" />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            대표자
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={representative} className={`bg-gray-200 ${inputStyle}`} placeholder="" />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            거래처담당자
          </Typography>
        </div>
        <div className="col-span-2">
          <Input 
            value={managerContact} 
            onChange={(e) => setManagerContact(e.target.value)} 
            placeholder="" 
            className={inputStyle}
          />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            종목
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={businessItem} className={`bg-gray-200 ${inputStyle}`} placeholder="" />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            거래처연락처
          </Typography>
        </div>
        <div className="col-span-2">
          <Input 
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              placeholder="" 
              className={inputStyle} 
            />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            업태
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={businessType} className={`bg-gray-200 ${inputStyle}`} placeholder="" />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            주소
          </Typography>
        </div>
        <div className="col-span-5">
          <div className="w-full">
            <TmpOrderAddAddress initialAddress={shippingAddress} />
          </div>
        </div>
        
       
      </div>
      
      <TmpOrderAddRow />
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" size="small" onClick={handleTempSave}>
          임시저장
        </Button>
        <Button 
          variant="primary" 
          size="small" 
          onClick={handleApply}
        >
          적용
        </Button>
      </div>
    </div>
  );
};
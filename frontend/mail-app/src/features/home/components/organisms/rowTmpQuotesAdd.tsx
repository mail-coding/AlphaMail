import React, { useEffect, useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { TmpQuoteAddAddress } from '../molecules/tmpQuoteAddAddress';
import { useTmpQuoteStore } from '../../stores/useTmpQuoteStore';
import { TmpQuoteAddClient } from '../molecules/tmpQuoteAddClient';
import { useHome } from '../../hooks/useHome';
import { useUser } from '@/features/auth/hooks/useUser';
import { TmpQuoteAddRow } from '../molecules/tmpQuoteAddRow';
import { showToast } from '@/shared/components/atoms/toast';

interface RowTmpQuotesAddProps {
  temporaryQuoteId?: number;
}

export const RowTmpQuotesAdd: React.FC<RowTmpQuotesAddProps> = ({ temporaryQuoteId }) => {
  const { 
    quoteNo, 
    licenseNumber, 
    representative, 
    businessType, 
    businessItem, 
    manager, 
    setManager, 
    managerContact, 
    setManagerContact,
    clientId,
    clientName,
    products,
    shippingAddress,
    initFromApiData
  } = useTmpQuoteStore();
  
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { useTemporaryQuote, useUpdateTemporaryQuote, useRegisterQuote } = useHome();
  const { data: user } = useUser();

  // 임시 견적서 데이터 조회
  const { data: quoteData, isLoading } = useTemporaryQuote(temporaryQuoteId || null);

  // API 데이터로 스토어 초기화
  useEffect(() => {
    if (quoteData) {
      console.log('견적서 데이터 로드:', quoteData);
      initFromApiData(quoteData);
    }
  }, [quoteData, initFromApiData]);
  
  const updateQuoteMutation = useUpdateTemporaryQuote();
  const registerQuoteMutation = useRegisterQuote();

  const handleTempSave = () => {
    if (!temporaryQuoteId) return;
    
    // 임시저장 데이터 구성
    const updateData = {
      clientId: clientId || undefined,
      clientName: clientId ? undefined : clientName,
      manager: manager || undefined,
      managerNumber: managerContact || undefined,
      shippingAddress: shippingAddress || undefined,
      hasShippingAddress: !!shippingAddress,
      products: products.map(product => ({
        productId: product.productId || undefined,
        productName: product.productId ? undefined : product.productName,
        count: product.count || 0
      }))
    };
    console.log('임시저장 전 products:', products);
    console.log('임시저장 요청 데이터:', updateData);
    // 임시저장 API 호출
    updateQuoteMutation.mutate({ 
      id: temporaryQuoteId, 
      data: updateData 
    });
  };
  
  const handleApply = () => {
    if (!temporaryQuoteId) return;
    
    // 유효성 검사
    if (!clientId) {
      setShowValidationErrors(true);
      showToast('거래처를 선택해주세요.', 'error');
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
    
    // 견적서 등록 데이터 구성
    const registerData = {
      id: temporaryQuoteId,
      clientId: clientId as number,
      companyId: companyId,
      manager: manager || undefined,
      managerNumber: managerContact || undefined,
      shippingAddress: shippingAddress || undefined,
      products: products
        .filter(product => product.productId)
        .map(product => ({
          productId: product.productId as number,
          count: product.count || 0
        }))
    };
    
    // 견적서 등록 API 호출
    registerQuoteMutation.mutate(registerData);
  };
  
  // 입력 필드 높이를 일관되게 유지하기 위한 스타일
  const inputStyle = "h-8 text-sm";
  
  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 bg-white rounded-sm p-4">
      <Typography variant="titleMedium" className="font-medium mb-4">
        견적서
      </Typography>
      
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            견적등록번호
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={quoteNo} className={`bg-gray-200 ${inputStyle}`} />
        </div>
        
      
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            견적담당자
          </Typography>
        </div>
        <div className="col-span-2">
          <Input 
            value={manager} 
            onChange={(e) => setManager(e.target.value)} 
            className={inputStyle}
          />
        </div>
        

        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            거래처명
          </Typography>
          {showValidationErrors && !clientId && (
            <span className="text-red-500 text-xs ml-1">* 필수</span>
          )}
        </div>
        <div className="col-span-5">
          <div className="w-full">
            <TmpQuoteAddClient initialClientName={clientName} />
          </div>
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            사업자등록번호
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={licenseNumber} className={`bg-gray-200 ${inputStyle}`} />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            대표자
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={representative} className={`bg-gray-200 ${inputStyle}`} />
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
            className={inputStyle}
          />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            종목
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={businessItem} className={`bg-gray-200 ${inputStyle}`} />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            거래처연락처
          </Typography>
        </div>
        <div className="col-span-2">
          <Input className={inputStyle} />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            업태
          </Typography>
        </div>
        <div className="col-span-2">
          <Input readOnly value={businessType} className={`bg-gray-200 ${inputStyle}`} />
        </div>
        
        <div className="col-span-1 flex items-center">
          <Typography variant="caption" className="text-gray-700">
            주소
          </Typography>
        </div>
        <div className="col-span-5">
          <div className="w-full">
            <TmpQuoteAddAddress />
          </div>
        </div>
      </div>
      
      <TmpQuoteAddRow showValidationErrors={showValidationErrors} />
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" size="small" onClick={handleTempSave}>
          임시저장
        </Button>
        <Button variant="primary" size="small" onClick={handleApply}>
          적용
        </Button>
      </div>
    </div>
  );
};
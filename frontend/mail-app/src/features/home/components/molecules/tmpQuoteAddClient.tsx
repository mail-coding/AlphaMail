import React, { useEffect } from 'react';
import { useTmpQuoteStore } from '../../stores/useTmpQuoteStore';
import ClientInput from '@/shared/components/atoms/clientInput';
import { Client } from '@/features/work/types/clients';
import { api } from '@/shared/lib/axiosInstance';

interface TmpQuoteAddClientProps {
  showValidationErrors?: boolean;
  initialClientName?: string;
}

export const TmpQuoteAddClient: React.FC<TmpQuoteAddClientProps> = ({ 
  showValidationErrors = false,
  initialClientName
}) => {
  const { 
    clientName, 
    setClientName, 
    setClientId,
    setLicenseNumber, 
    setRepresentative, 
    setBusinessType, 
    setBusinessItem 
  } = useTmpQuoteStore();

  // initialClientName이 있으면 스토어에 설정
  useEffect(() => {
    if (initialClientName && initialClientName !== clientName) {
      setClientName(initialClientName);
    }
  }, [initialClientName, clientName, setClientName]);

  const handleClientSelect = async (client: Client) => {
    console.log('선택된 거래처:', client); // 디버깅용
    
    try {
      // 거래처 상세 정보 조회
      const response = await api.get(`/api/erp/clients/${client.id}`);
      const clientDetail = response.data;
      
      console.log('거래처 상세 정보:', clientDetail); // 디버깅용
      
      // 거래처 ID 설정 (중요!)
      setClientId(client.id);
      
      // 거래처 정보 설정
      setClientName(client.corpName);
      setLicenseNumber(clientDetail.licenseNum || '');
      setRepresentative(clientDetail.representative || '');
      setBusinessType(clientDetail.businessType || '');
      setBusinessItem(clientDetail.businessItem || '');
    } catch (error) {
      console.error('거래처 상세 정보 조회 실패:', error);
      
      // API 호출 실패 시 기본 정보만 설정
      setClientId(client.id);
      setClientName(client.corpName);
      setLicenseNumber(client.licenseNumber || '');
      setRepresentative(client.representative || '');
      setBusinessType('');
      setBusinessItem('');
    }
  };

  return (
    <div className="w-full">
      <ClientInput
        value={clientName}
        onChange={handleClientSelect}
        className={`w-full !h-8 !text-sm !rounded-none ${
          showValidationErrors && !clientName ? 'border-red-500' : ''
        }`}
      />
      {showValidationErrors && !clientName && (
        <p className="text-red-500 text-xs mt-1">거래처를 선택해주세요</p>
      )}
    </div>
  );
};
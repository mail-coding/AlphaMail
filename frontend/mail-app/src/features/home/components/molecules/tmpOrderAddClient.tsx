import React, { useEffect } from 'react';
import { useTmpOrderStore } from '../../stores/useTmpOrderStore';
import ClientInput from '@/shared/components/atoms/clientInput';
import { Client } from '@/features/work/types/clients';
import { api } from '@/shared/lib/axiosInstance';

interface TmpOrderAddClientProps {
  initialClientName?: string;
}

export const TmpOrderAddClient: React.FC<TmpOrderAddClientProps> = ({ initialClientName }) => {
  const { 
    clientName, 
    clientId,
    setClientInfo
  } = useTmpOrderStore();

  // initialClientName이 있으면 스토어에 설정
  useEffect(() => {
    if (initialClientName && initialClientName !== clientName) {
      setClientInfo({
        clientId,
        clientName: initialClientName,
        licenseNumber: '',
        representative: '',
        businessType: '',
        businessItem: ''
      });
    }
  }, [initialClientName, clientName, clientId, setClientInfo]);

  const handleClientSelect = async (client: Client) => {
    console.log('선택된 거래처:', client); // 디버깅용
    
    try {
      // 거래처 상세 정보 조회
      const response = await api.get(`/api/erp/clients/${client.id}`);
      const clientDetail = response.data;
      
      console.log('거래처 상세 정보:', clientDetail); // 디버깅용
      
      // 거래처 정보 설정
      setClientInfo({
        clientId: client.id,
        clientName: client.corpName,
        licenseNumber: clientDetail.licenseNum || '',
        representative: clientDetail.representative || '',
        businessType: clientDetail.businessType || '',
        businessItem: clientDetail.businessItem || ''
      });
    } catch (error) {
      console.error('거래처 상세 정보 조회 실패:', error);
      
      // API 호출 실패 시 기본 정보만 설정
      setClientInfo({
        clientId: client.id,
        clientName: client.corpName,
        licenseNumber: client.licenseNumber || '',
        representative: client.representative || '',
        businessType: '',
        businessItem: ''
      });
    }
  };

  return (
    <div className="w-full">
      <ClientInput
        value={clientName}
        onChange={handleClientSelect}
        className="w-full !h-8 !text-sm !rounded-none"
      />
    </div>
  );
};
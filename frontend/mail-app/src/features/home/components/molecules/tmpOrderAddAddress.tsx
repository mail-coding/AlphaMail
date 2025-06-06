import React, { useEffect, useState } from 'react';
import { useTmpOrderStore } from '../../stores/useTmpOrderStore';
import AddressInput from '@/shared/components/atoms/addressInput';
import KakaoAddressTemplate from '@/shared/components/template/kakaoAddressTemplate';

interface TmpOrderAddAddressProps {
  initialAddress?: string;
}

export const TmpOrderAddAddress: React.FC<TmpOrderAddAddressProps> = ({ initialAddress }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shippingAddress, setShippingAddress } = useTmpOrderStore();

  useEffect(() => {
    if (initialAddress) {
      setShippingAddress(initialAddress);
    }
  }, [initialAddress, setShippingAddress]);

  const handleAddressSelect = (data: {
    address: string;
    zonecode: string;
    addressType: string;
    bname: string;
    buildingName: string;
  }) => {
    // 주소 정보에서 필요한 부분만 추출하여 저장
    let fullAddress = data.address;
    
    // 건물명이 있으면 추가
    if (data.buildingName) {
      fullAddress += ` (${data.buildingName})`;
    }
    
    setShippingAddress(fullAddress);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <AddressInput
        value={shippingAddress}
        onChange={setShippingAddress}
        className="w-full !h-8 !text-sm !rounded-none"
      />
      
      <KakaoAddressTemplate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddressSelect}
      />
    </div>
  );
};
import React, { useState } from 'react';
import { OrderDetail } from '../../../types/order';
import AddressInput from '../../../../../shared/components/atoms/addressInput';
import ClientInput from '../../../../../shared/components/atoms/clientInput';
import { Client } from '../../../types/clients';
import KakaoAddressTemplate from '../../../../../shared/components/template/kakaoAddressTemplate';

interface OrderBasicInfoFormProps {
  formData: OrderDetail;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const fields = [
  { name: 'order_no', label: '발주등록번호' },
  { name: 'date', label: '일자' },
  { name: 'manager', label: '발주담당자' },
  { name: 'client_name', label: '거래처명', component: 'client' },
  { name: 'business_no', label: '사업자등록번호' },
  { name: 'representative', label: '대표자' },
  { name: 'business_type', label: '업태' },
  { name: 'business_category', label: '종목' },
  { name: 'client_manager', label: '거래처담당자' },
  { name: 'client_contact', label: '거래처연락처' },
  { name: 'payment_condition', label: '결제조건' },
  { name: 'due_date', label: '납기일자' },
  { name: 'address', label: '주소', component: 'address', colSpan: 2 },
];

const OrderBasicInfoForm: React.FC<OrderBasicInfoFormProps> = ({ formData, onInputChange }) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleAddressChange = (value: string) => {
    const event = {
      target: {
        name: 'address',
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleAddressSelect = (data: {
    address: string;
    zonecode: string;
    addressType: string;
    bname: string;
    buildingName: string;
  }) => {
    handleAddressChange(data.address);
    setIsAddressModalOpen(false);
  };

  const handleClientChange = (client: Client) => {
    const events = [
      { target: { name: 'client_name', value: client.name } },
      { target: { name: 'business_no', value: client.business_no } },
      { target: { name: 'representative', value: client.ceo } },
      { target: { name: 'business_type', value: client.type || '' } },
      { target: { name: 'business_category', value: client.item || '' } },
      { target: { name: 'client_manager', value: '' } },
      { target: { name: 'client_contact', value: client.contact } },
      { target: { name: 'address', value: client.address } },
    ] as React.ChangeEvent<HTMLInputElement>[];

    events.forEach(event => onInputChange(event));
  };

  const renderField = (field: typeof fields[0]) => {
    const commonProps = {
      name: field.name,
      value: String(formData[field.name as keyof OrderDetail] || ''),
      className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2",
    };

    if (field.component === 'client') {
      return (
        <ClientInput
          key={field.name}
          value={formData.client_name}
          onChange={handleClientChange}
          className="mt-1"
        />
      );
    }

    if (field.component === 'address') {
      return (
        <AddressInput
          key={field.name}
          value={formData.address}
          onChange={handleAddressChange}
          onSearchClick={() => setIsAddressModalOpen(true)}
          className="mt-1"
        />
      );
    }

    return (
      <input
        key={field.name}
        type={field.name === 'date' || field.name === 'due_date' ? 'date' : 'text'}
        {...commonProps}
        onChange={onInputChange}
      />
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.name} className={field.colSpan === 2 ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>
      <KakaoAddressTemplate
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={handleAddressSelect}
      />
    </>
  );
};

export default OrderBasicInfoForm; 
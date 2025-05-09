import React, { useState } from 'react';
import { OrderDetail } from '../../../types/order';
import AddressInput from '../../../../../shared/components/atoms/addressInput';
import ClientInput from '../../../../../shared/components/atoms/clientInput';
import { Client } from '../../../types/clients';
import KakaoAddressTemplate from '../../../../../shared/components/template/kakaoAddressTemplate';
import { api } from '../../../../../shared/lib/axiosInstance';

interface OrderBasicInfoFormProps {
  formData: OrderDetail;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormField {
  name: keyof OrderDetail;
  label: string;
  component?: 'client' | 'address';
  colSpan?: number;
  type?: 'text' | 'date' | 'number';
  required?: boolean;
  validation?: (value: string) => string | null;
}

const fields: FormField[] = [
  { name: 'orderNo', label: '발주등록번호', required: true },
  { name: 'createdAt', label: '일자', type: 'date', required: true },
  { name: 'userName', label: '발주담당자', required: true },
  { name: 'clientName', label: '거래처명', component: 'client', required: true },
  { name: 'licenseNumber', label: '사업자등록번호', required: true },
  { name: 'representative', label: '대표자', required: true },
  { name: 'businessType', label: '업태' },
  { name: 'businessItem', label: '종목' },
  { name: 'manager', label: '거래처담당자' },
  { name: 'managerNumber', label: '거래처연락처' },
  { name: 'paymentTerm', label: '결제조건' },
  { name: 'deliveryAt', label: '납기일자', type: 'date', required: true },
  { name: 'shippingAddress', label: '주소', component: 'address', colSpan: 2, required: true },
];

const OrderBasicInfoForm: React.FC<OrderBasicInfoFormProps> = ({ formData, onInputChange }) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value) {
      return `${field.label}은(는) 필수 입력 항목입니다.`;
    }
    return field.validation ? field.validation(value) : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = fields.find(f => f.name === name);
    
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
    
    onInputChange(e);
  };

  const handleAddressChange = (value: string) => {
    const event = {
      target: {
        name: 'shippingAddress',
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

  const handleClientChange = async (client: Client) => {
    try {
      // 거래처 상세 정보 조회 API 호출
      const response = await api.get(`/api/clients/${client.id}`);
      const clientDetail = response.data;

      const events = [
        { target: { name: 'clientName', value: clientDetail.name } },
        { target: { name: 'licenseNumber', value: clientDetail.business_no } },
        { target: { name: 'representative', value: clientDetail.ceo } },
        { target: { name: 'businessType', value: clientDetail.type || '' } },
        { target: { name: 'businessItem', value: clientDetail.item || '' } },
      ] as React.ChangeEvent<HTMLInputElement>[];

      events.forEach(event => onInputChange(event));
    } catch (error) {
      console.error('거래처 정보 조회 실패:', error);
      alert('거래처 정보를 불러오는데 실패했습니다.');
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      name: field.name,
      value: String(formData[field.name] || ''),
      className: `mt-1 block w-full border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`,
      required: field.required,
    };

    if (field.component === 'client') {
      return (
        <ClientInput
          key={field.name}
          value={formData.clientName}
          onChange={handleClientChange}
          className="mt-1"
        />
      );
    }

    if (field.component === 'address') {
      return (
        <AddressInput
          key={field.name}
          value={formData.shippingAddress}
          onChange={handleAddressChange}
          onSearchClick={() => setIsAddressModalOpen(true)}
          className="mt-1"
        />
      );
    }

    return (
      <div>
        <input
          key={field.name}
          type={field.type || 'text'}
          {...commonProps}
          onChange={handleInputChange}
        />
        {errors[field.name] && (
          <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
        )}
      </div>
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
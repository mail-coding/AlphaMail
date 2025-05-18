import React, { useState } from 'react';
import { OrderDetail } from '../../../types/order';
import AddressInput from '../../../../../shared/components/atoms/addressInput';
import ClientInput from '../../../../../shared/components/atoms/clientInput';
import { Client } from '../../../types/clients';
import KakaoAddressTemplate from '../../../../../shared/components/template/kakaoAddressTemplate';
import { api } from '../../../../../shared/lib/axiosInstance';
import { useOrderStore } from '../../../stores/orderStore';

const OrderBasicInfoForm: React.FC = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { formData, updateFormField } = useOrderStore();

  if (!formData) {
    return null;
  }

  const validateField = (name: string, value: string): string | null => {
    if (!value) {
      return `${name}은 필수 입력 항목입니다.`;
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    updateFormField(name as keyof OrderDetail, value);
  };

  const handleAddressChange = (value: string) => {
    updateFormField('shippingAddress', value);
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
      const response = await api.get(`/api/erp/clients/${client.id}`);
      const clientDetail = response.data;

      // 각 필드에 대한 이벤트 생성
      const events = [
        { target: { name: 'clientId', value: client.id } },
        { target: { name: 'clientName', value: clientDetail.corpName } },
        { target: { name: 'licenseNumber', value: clientDetail.licenseNum } },
        { target: { name: 'representative', value: clientDetail.representative } },
        { target: { name: 'businessType', value: clientDetail.businessType || '' } },
        { target: { name: 'businessItem', value: clientDetail.businessItem || '' } },
        { target: { name: 'manager', value: clientDetail.manager || '' } },
        { target: { name: 'managerNumber', value: clientDetail.managerPhone || '' } },
        { target: { name: 'paymentTerm', value: clientDetail.paymentTerm || '' } },
        { target: { name: 'shippingAddress', value: clientDetail.address || '' } }
      ] as React.ChangeEvent<HTMLInputElement>[];

      // 각 이벤트를 순차적으로 처리
      for (const event of events) {
        handleInputChange(event);
      }
    } catch (error) {
      console.error('거래처 정보 조회 실패:', error);
      alert('거래처 정보를 불러오는데 실패했습니다.');
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderNo" className="block text-sm font-medium text-gray-700">발주등록번호</label>
          <input
            id="orderNo"
            name="orderNo"
            type="text"
            value={formData.orderNo || ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${errors.orderNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.orderNo && <p className="mt-1 text-sm text-red-500">{errors.orderNo}</p>}
        </div>

        <div>
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">일자</label>
          <input
            id="createdAt"
            name="createdAt"
            type="date"
            value={formData.createdAt ? new Date(formData.createdAt).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${errors.createdAt ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.createdAt && <p className="mt-1 text-sm text-red-500">{errors.createdAt}</p>}
        </div>

        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">발주담당자</label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={formData.userName || ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName}</p>}
        </div>

        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">거래처명</label>
          <ClientInput
            value={formData.clientName}
            onChange={handleClientChange}
            className="mt-1"
          />
          {errors.clientName && <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>}
        </div>

        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">사업자등록번호</label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            type="text"
            value={formData.licenseNumber || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label htmlFor="representative" className="block text-sm font-medium text-gray-700">대표자</label>
          <input
            id="representative"
            name="representative"
            type="text"
            value={formData.representative || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">업태</label>
          <input
            id="businessType"
            name="businessType"
            type="text"
            value={formData.businessType || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label htmlFor="businessItem" className="block text-sm font-medium text-gray-700">종목</label>
          <input
            id="businessItem"
            name="businessItem"
            type="text"
            value={formData.businessItem || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-gray-700">거래처담당자</label>
          <input
            id="manager"
            name="manager"
            type="text"
            value={formData.manager || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="managerNumber" className="block text-sm font-medium text-gray-700">거래처연락처</label>
          <input
            id="managerNumber"
            name="managerNumber"
            type="text"
            value={formData.managerNumber || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="paymentTerm" className="block text-sm font-medium text-gray-700">결제조건</label>
          <input
            id="paymentTerm"
            name="paymentTerm"
            type="text"
            value={formData.paymentTerm || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="deliveryAt" className="block text-sm font-medium text-gray-700">납기일자</label>
          <input
            id="deliveryAt"
            name="deliveryAt"
            type="date"
            value={formData.deliverAt ? new Date(formData.deliverAt).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${errors.deliveryAt ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.deliveryAt && <p className="mt-1 text-sm text-red-500">{errors.deliveryAt}</p>}
        </div>

        <div className="col-span-2">
          <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">주소</label>
          <AddressInput
            value={formData.shippingAddress}
            onChange={handleAddressChange}
            className="mt-1"
          />
          {errors.shippingAddress && <p className="mt-1 text-sm text-red-500">{errors.shippingAddress}</p>}
        </div>
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
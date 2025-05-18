import React, { useState } from 'react';
import { OrderDetail } from '../../../types/order';
import AddressInput from '../../../../../shared/components/atoms/addressInput';
import ClientInput from '../../../../../shared/components/atoms/clientInput';
import { Client } from '../../../types/clients';
import KakaoAddressTemplate from '../../../../../shared/components/template/kakaoAddressTemplate';
import { api } from '../../../../../shared/lib/axiosInstance';
import { useOrderStore } from '../../../stores/orderStore';
import { Typography } from '@/shared/components/atoms/Typography';

const OrderBasicInfoForm: React.FC = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { formData, updateFormField } = useOrderStore();

  if (!formData) {
    return null;
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      for (const event of events) {
        handleInputChange(event);
      }
    } catch (error) {
      console.error('거래처 정보 조회 실패:', error);
      alert('거래처 정보를 불러오는데 실패했습니다.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <colgroup>
          <col style={{ width: '140px' }} />
          <col style={{ width: '260px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '260px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '260px' }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">발주등록번호<span className="text-red-500 ml-1">*</span></Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="orderNo"
                name="orderNo"
                type="text"
                value={formData.orderNo || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                required
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">일자<span className="text-red-500 ml-1">*</span></Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="createdAt"
                name="createdAt"
                type="date"
                value={formData.createdAt ? new Date(formData.createdAt).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                required
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">발주담당자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                required
              />
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">거래처명<span className="text-red-500 ml-1">*</span></Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <ClientInput
                value={formData.clientName}
                onChange={handleClientChange}
                className="w-full h-[32px]"
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">사업자등록번호</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                value={formData.licenseNumber || ''}
                readOnly
                className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm focus:outline-none"
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">대표자</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <input
                id="representative"
                name="representative"
                type="text"
                value={formData.representative || ''}
                readOnly
                className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm focus:outline-none"
              />
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">종목</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <input
                id="businessItem"
                name="businessItem"
                type="text"
                value={formData.businessItem || ''}
                readOnly
                className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm focus:outline-none"
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">업태</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <input
                id="businessType"
                name="businessType"
                type="text"
                value={formData.businessType || ''}
                readOnly
                className="w-full h-[32px] px-2 border border-gray-300 bg-gray-50 text-sm focus:outline-none"
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">담당자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="manager"
                name="manager"
                type="text"
                value={formData.manager || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
              />
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">거래처연락처</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="managerNumber"
                name="managerNumber"
                type="text"
                value={formData.managerNumber || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">결제조건</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="paymentTerm"
                name="paymentTerm"
                type="text"
                value={formData.paymentTerm || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">납기일자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                id="deliverAt"
                name="deliverAt"
                type="date"
                value={formData.deliverAt ? new Date(formData.deliverAt).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                required
              />
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">주소</Typography>
            </td>
            <td colSpan={5} className="bg-white border border-[#E5E5E5] px-2">
              <AddressInput
                value={formData.shippingAddress}
                onChange={handleAddressChange}
                className="w-full h-[32px]"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <KakaoAddressTemplate
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={handleAddressSelect}
      />
    </div>
  );
};

export default OrderBasicInfoForm; 
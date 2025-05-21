import React, { useState, RefObject } from 'react';
import { OrderDetail } from '../../../types/order';
import AddressInput from '../../../../../shared/components/atoms/addressInput';
import ClientInput from '../../../../../shared/components/atoms/clientInput';
import { Client } from '../../../types/clients';
import KakaoAddressTemplate from '../../../../../shared/components/template/kakaoAddressTemplate';
import { api } from '../../../../../shared/lib/axiosInstance';
import { useOrderStore } from '../../../stores/orderStore';
import { Typography } from '@/shared/components/atoms/Typography';
import { useParams } from 'react-router-dom';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { PhoneInput } from '@/shared/components/atoms/phoneInput';
import { toast } from 'react-toastify';

const MAX_LENGTHS = {
  orderNo: 255,
  managerNumber: 13,
  paymentTerm: 255,
  manager: 30,
  shippingAddress: 255,
};

interface OrderBasicInfoFormProps {
  clientNameRef?: RefObject<HTMLInputElement>;
  managerRef?: RefObject<HTMLInputElement>;
  managerNumberRef?: RefObject<HTMLInputElement>;
  paymentTermRef?: RefObject<HTMLInputElement>;
  deliverAtRef?: RefObject<HTMLInputElement>;
  shippingAddressRef?: RefObject<HTMLInputElement>;
  onInputFocus?: () => void;
}

const OrderBasicInfoForm: React.FC<OrderBasicInfoFormProps> = ({
  clientNameRef,
  managerRef,
  managerNumberRef,
  paymentTermRef,
  deliverAtRef,
  shippingAddressRef,
  onInputFocus,
}) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { formData, updateFormField } = useOrderStore();
  const { id } = useParams();
  const { data: userInfo } = useUserInfo();

  if (!formData) {
    return null;
  }

  const validate = (name: string, value: string) => {
    let error = '';
    if (["clientName", "deliverAt", "shippingAddress"].includes(name) && !value) {
      error = '필수 입력 항목입니다.';
    }
    if (name in MAX_LENGTHS && value && value.length > MAX_LENGTHS[name as keyof typeof MAX_LENGTHS]) {
      error = `최대 ${MAX_LENGTHS[name as keyof typeof MAX_LENGTHS]}자까지 입력 가능합니다.`;
    }
    return error;
  };

  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');

    if (numbersOnly.startsWith('02')) {
      // 서울 지역번호
      if (numbersOnly.length <= 2) return numbersOnly;
      if (numbersOnly.length <= 5) return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2)}`;
      if (numbersOnly.length <= 9)
        return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 5)}-${numbersOnly.slice(5)}`;
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6, 10)}`;
    } else {
      // 휴대폰 또는 일반 지역번호 (3자리)
      if (numbersOnly.length <= 3) return numbersOnly;
      if (numbersOnly.length <= 6)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      if (numbersOnly.length <= 10)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'managerNumber') {
      newValue = formatPhoneNumber(value);
    }
    const error = validate(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
    updateFormField(name as keyof OrderDetail, newValue);
  };

  const handleAddressChange = (value: string) => {
    const error = validate('shippingAddress', value);
    setErrors(prev => ({ ...prev, shippingAddress: error }));
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
      toast.error('거래처 정보를 불러오는데 실패했습니다.');
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
            {id !== 'new' && (
              <>
                <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
                  <Typography variant="body">발주등록번호</Typography>
                </td>
                <td className="bg-white border border-[#E5E5E5] px-2">
                  <span className="text-sm"><Typography variant="body">{formData.orderNo || '-'}</Typography></span>
                </td>
              </>
            )}
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">일자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <span className="text-sm">
                <Typography variant="body">{(() => {
                  const date = formData.createdAt ? new Date(formData.createdAt) : new Date();
                  return date.toLocaleDateString('ko-KR');
                })()}</Typography>
              </span>
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">발주담당자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <span className="text-sm"><Typography variant="body">{userInfo?.name || '-'}</Typography></span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">거래처명<span className="text-red-500 ml-1">*</span></Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <ClientInput
                ref={clientNameRef}
                value={formData.clientName}
                onChange={handleClientChange}
                className="w-full h-[32px]"
                onFocus={onInputFocus}
                onClick={onInputFocus}
                preventFormSubmit={true}
              />
              {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">사업자등록번호</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <span className="text-sm"><Typography variant="body">{formData.licenseNumber || '-'}</Typography></span>
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">대표자</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <span className="text-sm"><Typography variant="body">{formData.representative || '-'}</Typography></span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">종목</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <span className="text-sm"><Typography variant="body">{formData.businessItem || '-'}</Typography></span>
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">업태</Typography>
            </td>
            <td className="bg-gray-50 border border-[#E5E5E5] px-2">
              <span className="text-sm"><Typography variant="body">{formData.businessType || '-'}</Typography></span>
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">거래 담당자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                ref={managerRef}
                id="manager"
                name="manager"
                type="text"
                value={formData.manager || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                maxLength={30}
                onFocus={onInputFocus}
              />
              {errors.manager && <p className="mt-1 text-xs text-red-500">{errors.manager}</p>}
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">거래처연락처</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <PhoneInput
                ref={managerNumberRef}
                id="managerNumber"
                name="managerNumber"
                value={formData.managerNumber || ''}
                onChange={handleInputChange}
                maxLength={13}
                errorMessage={errors.managerNumber}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                onFocus={onInputFocus}
              />
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">결제조건</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                ref={paymentTermRef}
                id="paymentTerm"
                name="paymentTerm"
                type="text"
                value={formData.paymentTerm || ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                maxLength={255}
                onFocus={onInputFocus}
              />
              {errors.paymentTerm && <p className="mt-1 text-xs text-red-500">{errors.paymentTerm}</p>}
            </td>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">납기일자<span className="text-red-500 ml-1">*</span></Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <input
                ref={deliverAtRef}
                id="deliverAt"
                name="deliverAt"
                type="date"
                value={formData.deliverAt ? new Date(formData.deliverAt).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full h-[32px] px-2 border border-gray-300 bg-white text-sm focus:outline-none"
                required
                onFocus={onInputFocus}
              />
              {errors.deliverAt && <p className="mt-1 text-xs text-red-500">{errors.deliverAt}</p>}
            </td>
          </tr>
          <tr>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">주소<span className="text-red-500 ml-1">*</span></Typography>
            </td>
            <td colSpan={5} className="bg-white border border-[#E5E5E5] px-2">
              <AddressInput
                ref={shippingAddressRef}
                value={formData.shippingAddress}
                onChange={handleAddressChange}
                className="w-full h-[32px]"
                onFocus={onInputFocus}
                onClick={onInputFocus}
              />
              {errors.shippingAddress && <p className="mt-1 text-xs text-red-500">{errors.shippingAddress}</p>}
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
import React, { useState, RefObject } from 'react';
import { useQuoteStore } from '../../../stores/quoteStore';
import AddressInput from '@/shared/components/atoms/addressInput';
import ClientInput from '@/shared/components/atoms/clientInput';
import KakaoAddressTemplate from '@/shared/components/template/kakaoAddressTemplate';
import { api } from '@/shared/lib/axiosInstance';
import { Client } from '../../../types/clients';
import { Typography } from '@/shared/components/atoms/Typography';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { PhoneInput } from '@/shared/components/atoms/phoneInput';
import { useParams } from 'react-router-dom';

const MAX_LENGTHS = {
  quoteNo: 255,
  managerNumber: 13,
  manager: 30,
  shippingAddress: 255,
};

interface QuoteBasicInfoFormProps {
  clientNameRef?: RefObject<HTMLInputElement>;
  managerNumberRef?: RefObject<HTMLInputElement>;
  shippingAddressRef?: RefObject<HTMLInputElement>;
  onInputFocus?: () => void;
}

const QuoteBasicInfoForm: React.FC<QuoteBasicInfoFormProps> = ({
  clientNameRef,
  managerNumberRef,
  shippingAddressRef,
  onInputFocus,
}) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { formData, setFormData } = useQuoteStore();
  const { id } = useParams();
  const { data: userInfo } = useUserInfo();

  if (!formData) return null;

  const validate = (name: string, value: string) => {
    let error = '';
    if (["quoteNo", "clientName", "createdAt", "shippingAddress"].includes(name) && !value) {
      error = '필수 입력 항목입니다.';
    }
    if (name in MAX_LENGTHS && value && value.length > MAX_LENGTHS[name as keyof typeof MAX_LENGTHS]) {
      error = `최대 ${MAX_LENGTHS[name as keyof typeof MAX_LENGTHS]}자까지 입력 가능합니다.`;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (value: string) => {
    const error = validate('shippingAddress', value);
    setErrors(prev => ({ ...prev, shippingAddress: error }));
    setFormData(prev => ({ ...prev, shippingAddress: value }));
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
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: clientDetail.corpName,
        licenseNumber: clientDetail.licenseNum,
        representative: clientDetail.representative,
        businessType: clientDetail.businessType || '',
        businessItem: clientDetail.businessItem || '',
        manager: clientDetail.manager || '',
        managerNumber: clientDetail.managerPhone || '',
        shippingAddress: clientDetail.address || '',
      }));
    } catch (error) {
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
            {id !== 'new' && (
            <>
            <td className="bg-[#F9F9F9] h-[44px] border border-[#E5E5E5] text-center align-middle font-medium">
              <Typography variant="body">견적등록번호</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <span className="text-sm"><Typography variant="body">{formData.quoteNo || '-'}</Typography></span>
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
              <Typography variant="body">담당자</Typography>
            </td>
            <td className="bg-white border border-[#E5E5E5] px-2">
              <span className="text-sm">
                <Typography variant="body">{userInfo?.name || '-'}</Typography>
              </span>
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

export default QuoteBasicInfoForm; 
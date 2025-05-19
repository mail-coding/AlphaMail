import React, { useEffect } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { TmpOrderAddAddress } from '../molecules/tmpOrderAddAddress';
import { FileUploadInput } from '../molecules/fileUploadInput';
import { useTmpClientStore } from '../../stores/useTmpClientStore';
import { useHome } from '../../hooks/useHome';
import { toast } from 'react-toastify';
import { useUser } from '@/features/auth/hooks/useUser'

interface RowTmpClientsAddProps {
  temporaryClientId?: number;
}

export const RowTmpClientsAdd: React.FC<RowTmpClientsAddProps> = ({ temporaryClientId }) => {
  const {data: user} = useUser();
  const {
    clientName,
    setClientName,
    representative,
    setRepresentative,
    licenseNumber,
    setLicenseNumber,
    businessType,
    setBusinessType,
    businessItem,
    setBusinessItem,
    managerPhone,
    setManagerPhone,
    managerEmail,
    setManagerEmail,
    businessLicenseFileName,
    setBusinessLicense,
    setBusinessLicenseFileName,
    address,
    setAddress,
  } = useTmpClientStore();

  const { 
    useTemporaryClient, 
    useUpdateTemporaryClient, 
    useRegisterClient 
  } = useHome();

  const { data: clientData, isLoading } = useTemporaryClient(temporaryClientId || null);
  const updateClientMutation = useUpdateTemporaryClient();
  const registerClientMutation = useRegisterClient();

    // 데이터 로드 시 상태 업데이트
    useEffect(() => {
      if (clientData) {
        setClientName(clientData.corpName || '');
        setRepresentative(clientData.representative || '');
        setLicenseNumber(clientData.licenseNum || '');
        setBusinessType(clientData.businessType || '');
        setBusinessItem(clientData.businessItem || '');
        setManagerPhone(clientData.phoneNumber || '');
        setManagerEmail(clientData.clientEmail || '');
        setBusinessLicenseFileName(clientData.businessLicense || '');
        setAddress(clientData.address || '');
      }
    }, [clientData]);
  
    const handleTempSave = () => {
      if (!temporaryClientId) return;
      
      setManagerEmail(managerEmail);
      // 임시저장 데이터 구성
      const updateData = {
        corpName: clientName,
        representative,
        licenseNum: licenseNumber,
        businessType,
        businessItem,
        phoneNumber: managerPhone,
        email: managerEmail,
        businessLicense: businessLicenseFileName,
        address
      };
      
      // 임시저장 API 호출
      updateClientMutation.mutate({ 
        id: temporaryClientId, 
        data: updateData 
      });
    };
  
    const handleApply = () => {
      if (!temporaryClientId) return;
      
      // 유효성 검사
      if (!clientName) {
        toast.error('거래처명을 입력해주세요.');
        return;
      }
      
      if (!representative) {
        toast.error('대표자명을 입력해주세요.');
        return;
      }
      
      if (!licenseNumber) {
        toast.error('사업자 번호를 입력해주세요.');
        return;
      }
      
      if (!businessType) {
        toast.error('종목을 입력해주세요.');
        return;
      }
      
      if (!businessItem) {
        toast.error('업태를 입력해주세요.');
        return;
      }
      
      // 거래처 등록 데이터 구성
      const registerData = {
        TemporaryClientId: temporaryClientId, // 대문자 T로 시작하는 것에 주의
        companyId: user?.companyId || 0, // 사용자의 회사 ID
        groupId: user?.groupId || 0, // 사용자의 그룹 ID
        licenseNum: licenseNumber,
        address: address || '',
        corpName: clientName,
        representative,
        businessType,
        businessItem,
        email: managerEmail || undefined,
        phoneNumber: managerPhone || undefined,
        businessLicense: businessLicenseFileName || undefined
      };
      
      // 거래처 등록 API 호출
      registerClientMutation.mutate(registerData);
    };
    
  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 bg-white rounded-sm p-4">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            사업자등록증 첨부
          </Typography>
        </div>
        <div className="col-span-5">
          <FileUploadInput
            value={businessLicenseFileName}
            onChange={setBusinessLicense}
            placeholder="사업자등록증 파일을 첨부하세요"
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            거래처명 <span className="text-red-500">*</span>
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            대표자명 <span className="text-red-500">*</span>
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={representative}
            onChange={(e) => setRepresentative(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            사업자 번호 <span className="text-red-500">*</span>
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="123-34-2123512"
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            종목 <span className="text-red-500">*</span>
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="종목을 입력하세요."
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            업태 <span className="text-red-500">*</span>
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={businessItem}
            onChange={(e) => setBusinessItem(e.target.value)}
            placeholder="업태를 입력하세요."
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            담당자 전화번호
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={managerPhone}
            onChange={(e) => setManagerPhone(e.target.value)}
            placeholder="전화번호"
            className="w-full"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            담당자 Email
          </Typography>
        </div>
        <div className="col-span-5">
          <Input 
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            placeholder="Email"
            className="w-full"
            type="email"
          />
        </div>

        <div className="col-span-1 flex items-center bg-[#CDECFC] p-2">
          <Typography variant="caption" className="text-gray-700">
            주소
          </Typography>
        </div>
        <div className="col-span-5">
          <div className="w-full">
            <TmpOrderAddAddress initialAddress={address}/>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" size="small" onClick={handleTempSave}>
          임시저장
        </Button>
        <Button variant="primary" size="small" onClick={handleApply}>
          등록
        </Button>
      </div>
    </div>
  );
};
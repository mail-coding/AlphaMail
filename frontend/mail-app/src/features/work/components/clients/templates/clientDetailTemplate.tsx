import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientDetail } from '../../../types/clients';
import { clientService } from '../../../services/clientService';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Typography } from '@/shared/components/atoms/Typography';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import AddressInput from '@/shared/components/atoms/addressInput';
import { showToast } from '@/shared/components/atoms/toast';

interface ClientDetailTemplateProps {
  onSave?: (data: ClientDetail) => void;
  onCancel: () => void;
}

export const ClientDetailTemplate: React.FC<ClientDetailTemplateProps> = ({
  onSave,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: clientData } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id!),
    enabled: !!id && id !== 'new',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!clientService.validateBusinessLicense(file)) {
      setUploadError('사업자등록증은 PDF, JPG, JPEG 또는 PNG 형식만 업로드 가능합니다.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');
      setUploadSuccess('');

      // 1. S3 업로드 먼저
      const s3Result = await clientService.uploadBusinessLicense(file);

      // 2. S3 업로드 성공 시 form에 URL/이름 저장
      setForm(prev => ({
        ...prev,
        businessLicenseUrl: s3Result.s3Key, // 실제로는 s3Key가 전체 URL이어야 함
        businessLicenseName: file.name
      }));

      // 3. OCR 요청
      const ocrResult = await clientService.uploadBusinessLicenseOCR(file);

      if (ocrResult.success) {
        setForm(prev => ({
          ...prev,
          licenseNum: ocrResult.licenseNum || prev.licenseNum,
          corpName: ocrResult.corpName || prev.corpName,
          representative: ocrResult.representative || prev.representative,
          address: ocrResult.address || prev.address,
          businessType: ocrResult.businessType || prev.businessType,
          businessItem: ocrResult.businessItem || prev.businessItem,
          // 파일 자체는 별도로 저장할 필요가 있다면 여기에 추가
          businessLicense: file.name // 파일 이름이나 다른 식별자 저장
        }));
        setUploadSuccess('사업자등록증이 성공적으로 인식되었습니다.');
      } else {
        setUploadError('사업자등록증을 인식하지 못했습니다. 수동으로 정보를 입력해주세요.');
      }

    } catch (error) {
      // API 호출 실패 등 모든 오류에 대해 동일한 메시지 사용
      setUploadError('사업자등록증을 인식하지 못했습니다. 수동으로 정보를 입력해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  const [form, setForm] = useState<ClientDetail>({
    id: clientData?.id || 1,
    corpName: clientData?.corpName || '',
    representative: clientData?.representative || '',
    licenseNum: clientData?.licenseNum || '',
    phoneNum: clientData?.phoneNum || '',
    email: clientData?.email || '',
    address: clientData?.address || '',
    businessType: clientData?.businessType || '',
    businessItem: clientData?.businessItem || '',
    businessLicenseUrl: clientData?.businessLicenseUrl || '',
    businessLicenseName: clientData?.businessLicenseName || '',
    createdAt: new Date().toISOString(),
    updatedAt: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (clientData) {
      setForm({
        id: clientData.id,
        corpName: clientData.corpName,
        representative: clientData.representative,
        licenseNum: clientData.licenseNum,
        phoneNum: clientData.phoneNum,
        email: clientData.email,
        address: clientData.address,
        businessType: clientData.businessType,
        businessItem: clientData.businessItem,
        businessLicenseUrl: clientData.businessLicenseUrl,
        businessLicenseName: clientData.businessLicenseName,
        createdAt: clientData.createdAt,
        updatedAt: clientData.updatedAt
      });
    }
  }, [clientData]);

  const createMutation = useMutation({
    mutationFn: (data: ClientDetail) => {
      if (!userInfo?.companyId || !userInfo?.groupId) {
        throw new Error('Company ID or Group ID is not available');
      }
      return clientService.createClient(userInfo.companyId, userInfo.groupId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (onSave) onSave(form);
      navigate('/work/clients', { replace: true });
    },
    onError: () => {
      showToast('저장에 실패했습니다.', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientDetail }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (onSave) onSave(form);
      navigate('/work/clients', { replace: true });
    },
    onError: () => {
      showToast('수정에 실패했습니다.', 'error');
    }
  });


  const handleDownloadBusinessLicense = async () => {
    if (!clientData?.businessLicenseUrl) {
      showToast('다운로드할 사업자등록증 파일이 없습니다.', 'error');
      return;
    }

    try {
      setIsDownloading(true);
      await clientService.downloadBusinessLicense(clientData.businessLicenseUrl);
      setIsDownloading(false);
    } catch  {
      showToast('파일 다운로드에 실패했습니다.', 'error');
      setIsDownloading(false);
    }
  };



  const formatBusinessLicense = (value: string) => {
    const onlyNums = value.replace(/\D/g, '').slice(0, 10); // 숫자만, 최대 10자리
    const part1 = onlyNums.slice(0, 3);
    const part2 = onlyNums.slice(3, 5);
    const part3 = onlyNums.slice(5, 10);
    let formatted = part1;
    if (part2) formatted += `-${part2}`;
    if (part3) formatted += `-${part3}`;
    return formatted;
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

  const isValidPhoneNumber = (value: string) => {
    const phoneRegex = /^(010-\d{4}-\d{4}|01[16789]-\d{3,4}-\d{4}|02-\d{3,4}-\d{4}|(031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)-\d{3,4}-\d{4})$/;
    return phoneRegex.test(value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'licenseNum') {
      const formatted = formatBusinessLicense(value);
      setForm((prev) => ({ ...prev, licenseNum: formatted }));
      return;
    }

    if (name === 'phoneNum') {
      const formatted = formatPhoneNumber(value);
      setForm((prev) => ({ ...prev, phoneNum: formatted }));
      return;
    }

    setForm((prev: ClientDetail) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // 필수 입력값 체크
    if (!form.corpName.trim()) {
      showToast('거래처명을 입력해 주세요.', 'error');
      return;
    } else if (!form.representative.trim()) {
      showToast('대표자명을 입력해 주세요.', 'error');
      return;
    } else if (!form.licenseNum.trim()) {
      showToast('사업자번호를 입력해 주세요.', 'error');
      return;
    } else if (!form.businessItem.trim()) {
      showToast('종목을 입력해 주세요.', 'error');
      return;
    } else if (!form.businessType.trim()) {
      showToast('업태를 입력해 주세요.', 'error');
      return;
    }

    // 추가 유효성 검사
    if (form.licenseNum.length !== 12) {
      return;
    }
    if (form.phoneNum && !isValidPhoneNumber(form.phoneNum)) {
      return;
    }
    if (form.email && !isValidEmail(form.email)) {
      return;
    }

    if (id && id !== 'new') {
      updateMutation.mutate({ id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow max-w-5xl mx-auto">
      <Typography variant="titleLarge" bold className="mb-6">
        거래처 {id && id !== 'new' ? '수정' : '등록'}
      </Typography>

      <div className="grid grid-cols-[180px_1fr] gap-y-2 w-full">
        {/* 사업자등록증 첨부 */}
        <div className=" flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">사업자등록증 첨부</Typography>
        </div>
        <div className="flex items-center h-[40px] border-b">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="businessLicenseFile"
          />
          <label htmlFor="businessLicenseFile" className="cursor-pointer mr-2">
            {isUploading ? (
              <span className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded">업로드 중...</span>
            ) : (
              <span className="px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded cursor-pointer">첨부파일</span>
            )}
          </label>
          
          {/* 다운로드 버튼 - 수정 모드에서만 표시 */}
          {id && id !== 'new' && clientData?.businessLicenseUrl && (
            <button
              type="button"
              onClick={handleDownloadBusinessLicense}
              disabled={isDownloading}
              className="ml-2 px-4 py-2 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded cursor-pointer"
            >
              {isDownloading ? '다운로드 중...' : '파일 다운로드'}
            </button>
          )}
          
          {uploadError && <span className="text-red-500 text-xs ml-2">{uploadError}</span>}
          {uploadSuccess && <span className="text-green-500 text-xs ml-2">{uploadSuccess}</span>}
          
          {/* 파일명 표시 - 클릭 시 다운로드 */}
          {form.businessLicenseUrl && (
            <span
              className="text-blue-500 text-xs ml-2 cursor-pointer hover:underline"
              onClick={() => clientService.downloadBusinessLicense(form.businessLicenseUrl)}
            >
              파일: {form.businessLicenseName}
            </span>
          )}
        </div>

        {/* 거래처명 */}
        <div className=" flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">거래처명 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="corpName"
            value={form.corpName}
            onChange={handleChange}
            placeholder="거래처명을 입력하세요."
            size="large"
            className="!w-[400px]"
            maxLength={50}
          />
          {isSubmitted && !form.corpName.trim() && (
            <span className="text-red-500 text-xs ml-2">거래처명을 입력해 주세요.</span>
          )}
          {form.corpName.length > 0 && (
            <span className="text-blue-500 text-xs ml-2">{form.corpName.length}/50자</span>
          )}
          {form.corpName.length > 50 && (
            <span className="text-red-500 text-xs ml-2">최대 50자까지 입력 가능합니다.</span>
          )}
        </div>

        {/* 대표자명 */}
        <div className="flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">대표자명 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="representative"
            value={form.representative}
            onChange={handleChange}
            placeholder="대표자명을 입력하세요."
            size="large"
            className="!w-[400px]"
            maxLength={10}
          />
          {isSubmitted && !form.representative.trim() && (
            <span className="text-red-500 text-xs ml-2">대표자명을 입력해 주세요.</span>
          )}
          {form.representative.length > 0 && (
            <span className="text-blue-500 text-xs ml-2">{form.representative.length}/10자</span>
          )}
          {form.representative.length > 10 && (
            <span className="text-red-500 text-xs ml-2">최대 10자까지 입력 가능합니다.</span>
          )}
        </div>

        {/* 사업자 번호 */}
        <div className=" flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">사업자 번호 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="licenseNum"
            value={form.licenseNum}
            onChange={handleChange}
            placeholder="사업자 번호를 입력하세요."
            size="large"
            className="!w-[400px]"
            inputMode='numeric'
            maxLength={12}
          />
          {form.licenseNum.length > 0 && form.licenseNum.length !== 12 && (
            <span className="text-red-500 text-xs ml-2">사업자번호는 10자리 숫자입니다.</span>
          )}
          {isSubmitted && !form.licenseNum.trim() && (
            <span className="text-red-500 text-xs ml-2">사업자번호를 입력해 주세요.</span>
          )}
          {form.licenseNum.length == 12 && (
            <span className="text-blue-500 text-xs ml-2">올바른 사업자번호 형식입니다.</span>
          )}
        </div>

        {/* 종목 */}
        <div className="flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">종목 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="businessItem"
            value={form.businessItem}
            onChange={handleChange}
            placeholder="종목을 입력하세요."
            size="large"
            className="!w-[400px]"
            maxLength={100}
          />
          {isSubmitted && !form.businessItem.trim() && (
            <span className="text-red-500 text-xs ml-2">종목을 입력해 주세요.</span>
          )}
          {form.businessItem.length > 0 && (
            <span className="text-blue-500 text-xs ml-2">{form.businessItem.length}/100자</span>
          )}
          {form.businessItem.length > 100 && (
            <span className="text-red-500 text-xs ml-2">최대 100자까지 입력 가능합니다.</span>
          )}
        </div>

        {/* 업태 */}
        <div className="flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">업태 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            placeholder="업태를 입력하세요."
            size="large"
            className="!w-[400px]"
            maxLength={100}
          />
          {isSubmitted && !form.businessType.trim() && (
            <span className="text-red-500 text-xs ml-2">업태를 입력해 주세요.</span>
          )}
          {form.businessType.length > 0 && (
            <span className="text-blue-500 text-xs ml-2">{form.businessType.length}/100자</span>
          )}
          {form.businessType.length > 100 && (
            <span className="text-red-500 text-xs ml-2">최대 100자까지 입력 가능합니다.</span>
          )}
        </div>

        {/* 담당자 전화번호 */}
        <div className="flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">담당자 전화번호</Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="phoneNum"
            value={form.phoneNum}
            onChange={handleChange}
            maxLength={13}
            inputMode='numeric'
            placeholder="전화번호"
            size="large"
            className="!w-[400px]"
          />
          {form.phoneNum && !isValidPhoneNumber(form.phoneNum) && (
            <span className="text-red-500 text-xs ml-2">전화번호 형식이 올바르지 않습니다.</span>
          )}
          {isValidPhoneNumber(form.phoneNum) && form.phoneNum.length > 0 && form.phoneNum.length <= 13 && (
            <span className="text-blue-500 text-xs ml-2">올바른 전화번호 형식입니다.</span>
          )}
        </div>

        {/* 담당자 Email */}
        <div className="flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body">담당자 Email</Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            size="large"
            className="!w-[400px]"
            maxLength={128}
          />
          {form.email && !isValidEmail(form.email) && (
            <span className="text-red-500 text-xs ml-2">이메일 형식이 올바르지 않습니다.</span>
          )}
          {isValidEmail(form.email) && form.email.length > 0 && form.email.length <= 128 && (
            <span className="text-blue-500 text-xs ml-2">올바른 이메일 형식입니다.</span>
          )}
          {form.email.length > 128 && (
            <span className="text-red-500 text-xs ml-2">최대 128자까지 입력 가능합니다.</span>
          )}
        </div>

        {/* 주소 */}
        <div className="flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" >주소</Typography>
        </div>
        <div className="flex flex-col gap-2 h-[40px] border-b justify-center w-auto">
          <div className="flex gap-2">
            <AddressInput
              value={form.address}
              onChange={val => setForm(prev => ({ ...prev, address: val }))}
              placeholder="주소 검색"
              className="!w-[400px]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isSubmitting}
          className="w-[80px] h-[30px]"
        >
          {isSubmitting ? '처리중...' : (id && id !== 'new' ? '수정' : '등록')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="large"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-[80px] h-[30px]"
        >
          취소
        </Button>
      </div>
    </form>
  );
};
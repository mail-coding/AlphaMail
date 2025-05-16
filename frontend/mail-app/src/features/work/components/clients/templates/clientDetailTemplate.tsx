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

  const { data: clientData } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id!),
    enabled: !!id && id !== 'new',
  });

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
    businessLicense: clientData?.businessLicense || '',
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
        businessLicense: clientData.businessLicense,
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
      alert('저장에 실패했습니다.');
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
      alert('수정에 실패했습니다.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: ClientDetail) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (
      !form.corpName.trim() ||
      !form.representative.trim() ||
      !form.licenseNum.trim() ||
      !form.businessItem.trim() ||
      !form.businessType.trim()
    ) {
      alert('필수 항목을 모두 입력해 주세요.');
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
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>사업자등록증 첨부</Typography>
        </div>
        <div className="flex items-center h-[40px] border-b">
          <Button variant="ghost" size="small">첨부파일</Button>
        </div>

        {/* 거래처명 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>거래처명 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="corpName"
            value={form.corpName}
            onChange={handleChange}
            placeholder="거래처명을 입력하세요."
            size="large"
            className="!w-[400px]"
          />
          {isSubmitted && !form.corpName.trim() && (
            <span className="text-red-500 text-xs ml-2">거래처명을 입력해 주세요.</span>
          )}
        </div>

        {/* 대표자명 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>대표자명 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="representative"
            value={form.representative}
            onChange={handleChange}
            placeholder="대표자명을 입력하세요."
            size="large"
            className="!w-[400px]"
          />
          {isSubmitted && !form.representative.trim() && (
            <span className="text-red-500 text-xs ml-2">대표자명을 입력해 주세요.</span>
          )}
        </div>

        {/* 사업자 번호 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>사업자 번호 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="licenseNum"
            value={form.licenseNum}
            onChange={handleChange}
            placeholder="사업자 번호를 입력하세요."
            size="large"
            className="!w-[400px]"
          />
          {isSubmitted && !form.licenseNum.trim() && (
            <span className="text-red-500 text-xs ml-2">사업자번호를 입력해 주세요.</span>
          )}
        </div>

        {/* 종목 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>종목 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="businessItem"
            value={form.businessItem}
            onChange={handleChange}
            placeholder="종목을 입력하세요."
            size="large"
            className="!w-[400px]"
          />
          {isSubmitted && !form.businessItem.trim() && (
            <span className="text-red-500 text-xs ml-2">종목을 입력해 주세요.</span>
          )}
        </div>

        {/* 업태 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>업태 <span className="text-red-500">*</span></Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            placeholder="업태를 입력하세요."
            size="large"
            className="!w-[400px]"
          />
          {isSubmitted && !form.businessType.trim() && (
            <span className="text-red-500 text-xs ml-2">업태를 입력해 주세요.</span>
          )}
        </div>

        {/* 담당자 전화번호 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>담당자 전화번호</Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="phoneNum"
            value={form.phoneNum}
            onChange={handleChange}
            placeholder="전화번호"
            size="large"
            className="!w-[400px]"
          />
        </div>

        {/* 담당자 Email */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>담당자 Email</Typography>
        </div>
        <div className="h-[40px] border-b w-auto">
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            size="large"
            className="!w-[400px]"
          />
        </div>

        {/* 주소 */}
        <div className="bg-[#E6F4FB] flex items-center justify-end px-4 h-[40px] border-b border-white">
          <Typography variant="body" bold>주소</Typography>
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
          className="w-[110px] h-[40px]"
        >
          {isSubmitting ? '처리중...' : (id && id !== 'new' ? '수정' : '등록')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="large"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-[110px] h-[40px]"
        >
          취소
        </Button>
      </div>
    </form>
  );
};
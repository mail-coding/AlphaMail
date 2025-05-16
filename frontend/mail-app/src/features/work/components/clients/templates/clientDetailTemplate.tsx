import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientDetail } from '../../../types/clients';
import { clientService } from '../../../services/clientService';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Typography } from '@/shared/components/atoms/Typography';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

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
    if (id && id !== 'new') {
      updateMutation.mutate({ id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow max-w-3xl mx-auto">
      <Typography variant="titleLarge" bold className="mb-6">
        거래처 {id && id !== 'new' ? '수정' : '등록'}
      </Typography>

      <div className="mb-4">
        <Typography variant="body" color="text-gray-600" className="mb-2">
          사업자등록증 첨부
        </Typography>
        <Button variant="ghost" size="small">
          첨부파일
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            거래처명 *
          </Typography>
          <Input
            name="corpName"
            value={form.corpName}
            onChange={handleChange}
            required
            placeholder="거래처명을 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            대표자명
          </Typography>
          <Input
            name="representative"
            value={form.representative}
            onChange={handleChange}
            placeholder="대표자명을 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            사업자 번호
          </Typography>
          <Input
            name="licenseNum"
            value={form.licenseNum}
            onChange={handleChange}
            placeholder="사업자 번호를 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            전화번호
          </Typography>
          <Input
            name="phoneNum"
            value={form.phoneNum}
            onChange={handleChange}
            placeholder="전화번호를 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            Email
          </Typography>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email을 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            주소
          </Typography>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            업태
          </Typography>
          <Input
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            placeholder="업태를 입력하세요."
            size="large"
          />
        </div>

        <div>
          <Typography variant="body" color="text-gray-600" className="mb-2">
            종목
          </Typography>
          <Input
            name="businessItem"
            value={form.businessItem}
            onChange={handleChange}
            placeholder="종목을 입력하세요."
            size="large"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리중...' : (id && id !== 'new' ? '수정' : '등록')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="large"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
      </div>
    </form>
  );
};
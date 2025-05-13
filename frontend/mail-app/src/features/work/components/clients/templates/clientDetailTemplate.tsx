import React, { useState } from 'react';
import { ClientDetail } from '../../../types/clients';
import { clientService } from '../../../services/clientService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Typography } from '@/shared/components/atoms/Typography';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

interface ClientDetailTemplateProps {
  client?: ClientDetail;
  onSave?: (data: ClientDetail) => void;
  onCancel: () => void;
}

export const ClientDetailTemplate: React.FC<ClientDetailTemplateProps> = ({
  client,
  onSave,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const [form, setForm] = useState<ClientDetail>({
    id: client?.id || 1,
    corpName: client?.corpName || '',
    representative: client?.representative || '',
    licenseNum: client?.licenseNum || '',
    phoneNum: client?.phoneNum || '',
    email: client?.email || '',
    address: client?.address || '',
    businessType: client?.businessType || '',
    businessItem: client?.businessItem || '',
    businessLicense: client?.businessLicense || '',
    createdAt: new Date().toISOString(),
    updatedAt: null
  });

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
    if (client && client.id) {
      updateMutation.mutate({ id: String(client.id), data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow max-w-3xl mx-auto">
      <Typography variant="titleLarge" bold className="mb-6">
        거래처 {client ? '수정' : '등록'}
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
          {isSubmitting ? '처리중...' : (client ? '수정' : '등록')}
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
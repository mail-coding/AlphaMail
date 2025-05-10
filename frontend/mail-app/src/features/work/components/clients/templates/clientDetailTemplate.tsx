import React, { useState } from 'react';
import { Client, ClientDetail } from '../../../types/clients';
import { clientService } from '../../../services/clientService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ClientDetailTemplateProps {
  client?: Client;
  onSave?: (data: ClientDetail) => void;
  onCancel: () => void;
}

export const ClientDetailTemplate: React.FC<ClientDetailTemplateProps> = ({
  client,
  onSave,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ClientDetail>({
    id: client?.id || 0,
    corpName: client?.corpName || '',
    representative: client?.representative || '',
    licenseNum: client?.licenseNumber || '',
    phoneNum: client?.phoneNumber || '',
    email: client?.email || '',
    address: client?.address || '',
    businessType: '',
    businessItem: '',
    businessLicense: '',
    createdAt: new Date().toISOString(),
    updatedAt: null
  });

  const createMutation = useMutation({
    mutationFn: (data: ClientDetail) => clientService.createClient(data),
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
      <h2 className="mb-4 font-bold">거래처 {client ? '수정' : '등록'}</h2>
      <div className="mb-2">
        <label className="block mb-1">사업자등록증 첨부</label>
        <button type="button" className="px-2 py-1 border rounded">첨부파일</button>
      </div>
      <div className="mb-2">
        <label className="block mb-1">거래처명 *</label>
        <input 
          name="corpName" 
          value={form.corpName} 
          onChange={handleChange} 
          required 
          className="w-full border p-2" 
          placeholder="거래처명을 입력하세요." 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">대표자명</label>
        <input 
          name="representative" 
          value={form.representative} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="대표자명을 입력하세요." 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">사업자 번호</label>
        <input 
          name="licenseNum" 
          value={form.licenseNum} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="사업자 번호를 입력하세요." 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">전화번호</label>
        <input 
          name="phoneNum" 
          value={form.phoneNum} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="전화번호를 입력하세요." 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Email</label>
        <input 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="Email" 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">주소</label>
        <input 
          name="address" 
          value={form.address} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="주소" 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">업태</label>
        <input 
          name="businessType" 
          value={form.businessType} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="업태" 
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">종목</label>
        <input 
          name="businessItem" 
          value={form.businessItem} 
          onChange={handleChange} 
          className="w-full border p-2" 
          placeholder="종목" 
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리중...' : (client ? '수정' : '등록')}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-gray-400 text-white px-4 py-2 rounded" 
          disabled={isSubmitting}
        >
          취소
        </button>
      </div>
    </form>
  );
};
import { api } from '@/shared/lib/axiosInstance';
import {
  Client,
  ClientDetail,
  ClientResponse,
} from '../types/clients';


interface GetClientsParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: number;
  companyId: number;
}

export const clientService = {
  // 거래처 목록 조회
  getClients: async (params: GetClientsParams) => {
    const response = await api.get<ClientResponse>(`/api/erp/companies/${params.companyId}/clients`, {
      params: {
        ...(params?.query && { query: params.query }),
        ...(params?.page && { page: params.page - 1 }),
        ...(params?.size && { size: params.size })
      }
    });

    return response.data;
  },

  // 거래처 상세 조회
  getClient: async (id: string) => {
    const response = await api.get<ClientDetail>(`/api/erp/clients/${id}`);
    return response.data;
  },

  // 거래처 생성
  createClient: async (companyId: number, groupId: number, client: ClientDetail) => {
    const requestData = {
      companyId: companyId,
      groupId: groupId,
      licenseNum : client.licenseNum,
      corpName : client.corpName,
      representative : client.representative,
      phoneNum : client.phoneNum,
      email : client.email,
      address : client.address,
      businessType : client.businessType,
      businessItem : client.businessItem,
      businessLicense : client.businessLicense,
    };

    const response = await api.post<Client>('/api/erp/clients', requestData);
    return response.data;
  },

  // 거래처 수정
  updateClient: async (id: string, client: ClientDetail) => {
    const requestData = {
      licenseNum : client.licenseNum,
      corpName : client.corpName,
      representative : client.representative,
      phoneNum : client.phoneNum,
      email : client.email,
      address : client.address,
      businessType : client.businessType,
      businessItem : client.businessItem,
      businessLicense : client.businessLicense,
    };

    const response = await api.put<ClientDetail>(`/api/erp/clients/${id}`, requestData);
    return response.data;
  },

  // 거래처 삭제
  deleteClient: async (id: number) => {
    await api.delete(`/api/erp/clients/${id}`);
  },

  // 선택된 거래처들 삭제 (옵션)
  deleteClients: async (ids: number[]) => {
    await api.post('/api/erp/clients/delete', {
      ids: ids
    });
  }
};
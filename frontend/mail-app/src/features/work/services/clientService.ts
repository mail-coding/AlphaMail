import { api } from '@/shared/lib/axiosInstance';
import {
  Client,
  ClientDetail,
  ClientResponse,
  UpdateClientRequest,
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
        ...(params?.page && { page: params.page }),
        ...(params?.size && { size: params.size }),
        ...(params?.sort && { sort: params.sort })
      }
    });
    return response.data;
  },

  // 거래처 상세 조회
  getClient: async (id: string) => {
    const response = await api.get<Client>(`/api/erp/clients/${id}`);
    return response.data;
  },

  // 거래처 생성
  createClient: async (client: ClientDetail) => {
    const response = await api.post<Client>('/api/erp/clients', client);
    return response.data;
  },

  // 거래처 수정
  updateClient: async (id: string, client: UpdateClientRequest) => {
    const response = await api.put<Client>(`/api/erp/clients/${id}`, client);
    return response.data;
  },

  // 거래처 삭제
  deleteClient: async (id: string) => {
    await api.delete(`/api/erp/clients/${id}`);
  },

  // 선택된 거래처들 삭제 (옵션)
  deleteClients: async (ids: number[]) => {
    await api.delete('/api/erp/clients', {
      data: { ids }
    });
  }
};
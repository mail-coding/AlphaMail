import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import { ClientResponse } from '../types/clients';

interface UseClientsParams {
  companyId: number;
  query?: string;
  page?: number;
  size?: number;
  sort?: number;
}

export const useClients = (
  params: UseClientsParams,
  placeholderData?: ClientResponse
): UseQueryResult<ClientResponse> => {
  return useQuery<ClientResponse>({
    queryKey: ['clients', params],
    queryFn: () => clientService.getClients(params),
    placeholderData,
  });
}; 
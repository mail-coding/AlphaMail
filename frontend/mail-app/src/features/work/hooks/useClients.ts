import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import { ClientResponse } from '../types/clients';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

interface UseClientsParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: number;
}

export const useClients = (
  params: UseClientsParams,
  placeholderData?: ClientResponse
): UseQueryResult<ClientResponse> => {
  const { data: userInfo, isLoading: isUserLoading } = useUserInfo();
  const companyId = userInfo?.companyId;

  return useQuery<ClientResponse>({
    queryKey: ['clients', { ...params, companyId }],
    queryFn: () => clientService.getClients({ ...params, companyId: companyId! }),
    placeholderData,
    enabled: !isUserLoading && !!companyId,
  });
}; 
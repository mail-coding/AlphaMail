import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import { ClientDetail } from '../types/clients';
import { useUserStore } from '@/shared/stores/useUserStore';

export const useClient = (clientId: number | null) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useQuery<ClientDetail>({
    queryKey: ['client', clientId],
    queryFn: () => clientService.getClient(String(clientId!)),
    enabled: isAuthenticated && clientId !== null,
    staleTime: 0,
    gcTime: 0,
  });
}; 
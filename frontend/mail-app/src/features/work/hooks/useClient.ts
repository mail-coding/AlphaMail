import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import { ClientDetail } from '../types/clients';

export const useClient = (id: number | null) => {
  return useQuery<ClientDetail>({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(String(id!)),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
}; 
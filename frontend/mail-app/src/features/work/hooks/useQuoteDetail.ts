import { useQuery } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QuoteDetail } from '../types/quote';
import { useUserStore } from '@/shared/stores/useUserStore';

export const useQuoteDetail = (quoteId: number | null) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useQuery<QuoteDetail | null>({
    queryKey: ['quoteDetail', quoteId],
    queryFn: () => (quoteId ? quoteService.getQuoteById(quoteId) : null),
    enabled: isAuthenticated && quoteId !== null,
  });
}; 
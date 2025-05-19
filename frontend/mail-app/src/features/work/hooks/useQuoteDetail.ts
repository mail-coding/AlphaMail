import { useQuery } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QuoteDetail } from '../types/quote';

export const useQuoteDetail = (id: number | null) => {
  return useQuery<QuoteDetail | null>({
    queryKey: ['quote', id],
    queryFn: () => (id ? quoteService.getQuoteById(id) : null),
    enabled: !!id,
  });
}; 
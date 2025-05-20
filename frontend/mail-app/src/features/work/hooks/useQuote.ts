import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QuoteResponse, QuoteQueryParams, QuoteDetail } from '../types/quote';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

interface UseQuotesReturn {
  data: QuoteResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  handleCreateQuote: (data: QuoteDetail) => void;
  handleUpdateQuote: (data: QuoteDetail) => void;
}

export const useQuotes = (params: QuoteQueryParams): UseQuotesReturn => {
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.id;
  const companyId = userInfo?.companyId;
  const groupId = userInfo?.groupId;
  const queryClient = useQueryClient();


  const { data, isLoading, error } = useQuery<QuoteResponse>({
    queryKey: ['quotes', params, companyId],
    queryFn: () => quoteService.getQuotes(params, companyId!),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (data: QuoteDetail) => quoteService.createQuote(data, companyId!, userId!, groupId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: QuoteDetail) => quoteService.updateQuote(data, companyId!, userId!, groupId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });

  return {
    data,
    isLoading,
    error,
    handleCreateQuote: createMutation.mutate,
    handleUpdateQuote: updateMutation.mutate,
  };
}; 
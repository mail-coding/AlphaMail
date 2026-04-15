import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QuoteResponse, QuoteQueryParams, QuoteDetail } from '../types/quote';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useUserStore } from '@/shared/stores/useUserStore';

interface UseQuotesReturn {
  data: QuoteResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  handleCreateQuote: (data: QuoteDetail) => void;
  handleUpdateQuote: (data: QuoteDetail) => void;
}

export const useQuotes = (params: QuoteQueryParams): UseQuotesReturn => {
  const { data: userInfo } = useUserInfo();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<QuoteResponse>({
    queryKey: ['quotes', params, userInfo?.companyId],
    queryFn: async () => {
      if (!userInfo?.companyId) {
        throw new Error('Company ID is not available');
      }
      const response = await quoteService.getQuotes(params, userInfo.companyId);
      return {
        ...response,
        currentPage: response.currentPage + 1,
      };
    },
    enabled: isAuthenticated && !!userInfo?.companyId,
  });

  const createMutation = useMutation({
    mutationFn: (data: QuoteDetail) => {
      if (!userInfo?.companyId || !userInfo?.id || !userInfo?.groupId) {
        throw new Error('User information is not available');
      }
      return quoteService.createQuote(data, userInfo.companyId, userInfo.id, userInfo.groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: QuoteDetail) => {
      if (!userInfo?.companyId || !userInfo?.id || !userInfo?.groupId) {
        throw new Error('User information is not available');
      }
      return quoteService.updateQuote(data, userInfo.companyId, userInfo.id, userInfo.groupId);
    },
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
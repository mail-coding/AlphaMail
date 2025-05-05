import { useCallback } from 'react';
import { useQuoteStore } from '../stores/quoteStore';
import { QuoteQueryParams, CreateQuoteRequest, UpdateQuoteRequest } from '../types/quote';

export const useQuote = () => {
  const {
    quotes,
    selectedQuote,
    totalCount,
    pageCount,
    isLoading,
    error,
    fetchQuotes,
    fetchQuoteById,
    createQuote,
    updateQuote,
    deleteQuote,
    clearError,
  } = useQuoteStore();

  const handleFetchQuotes = useCallback(
    async (params?: QuoteQueryParams) => {
      await fetchQuotes(params);
    },
    [fetchQuotes]
  );

  const handleFetchQuoteById = useCallback(
    async (id: number) => {
      await fetchQuoteById(id);
    },
    [fetchQuoteById]
  );

  const handleCreateQuote = useCallback(
    async (data: CreateQuoteRequest) => {
      await createQuote(data);
    },
    [createQuote]
  );

  const handleUpdateQuote = useCallback(
    async (data: UpdateQuoteRequest) => {
      await updateQuote(data);
    },
    [updateQuote]
  );

  const handleDeleteQuote = useCallback(
    async (id: number) => {
      await deleteQuote(id);
    },
    [deleteQuote]
  );

  return {
    quotes,
    selectedQuote,
    totalCount,
    pageCount,
    isLoading,
    error,
    handleFetchQuotes,
    handleFetchQuoteById,
    handleCreateQuote,
    handleUpdateQuote,
    handleDeleteQuote,
    clearError,
  };
}; 
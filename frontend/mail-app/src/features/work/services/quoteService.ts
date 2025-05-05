import { api } from '@/shared/lib/axiosInstance';
import {
  Quote,
  QuoteDetail,
  QuoteResponse,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  QuoteQueryParams,
} from '../types/quote';

export const quoteService = {
  getQuotes: async (params?: QuoteQueryParams): Promise<QuoteResponse> => {
    const response = await api.get<QuoteResponse>('/quotes', { params });
    return response.data;
  },

  getQuoteById: async (id: number): Promise<QuoteDetail> => {
    const response = await api.get<QuoteDetail>(`/quotes/${id}`);
    return response.data;
  },

  createQuote: async (data: CreateQuoteRequest): Promise<Quote> => {
    const response = await api.post<Quote>('/quotes', data);
    return response.data;
  },

  updateQuote: async (data: UpdateQuoteRequest): Promise<Quote> => {
    const response = await api.put<Quote>(`/quotes/${data.id}`, data);
    return response.data;
  },

  deleteQuote: async (id: number): Promise<void> => {
    await api.delete(`/quotes/${id}`);
  },
}; 
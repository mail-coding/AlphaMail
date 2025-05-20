import { api } from '@/shared/lib/axiosInstance';
import {
  Quote,
  QuoteDetail,
  QuoteResponse,
  QuoteQueryParams,
  parseQuoteResponse,
  parseQuoteDetail,
} from '../types/quote';

export const quoteService = {
  getQuotes: async (params?: QuoteQueryParams, companyId?: number): Promise<QuoteResponse> => {
    const rawParams = {
      ...params,
      page: params?.page ? params.page - 1 : 0,
    }

    const filteredParams = Object.fromEntries(
      Object.entries(rawParams).filter(([_, v]) =>
        v !== null && v !== undefined && v !== ''
      )
    );

    console.log("filteredParams", filteredParams);
    const response = await api.get(`/api/erp/companies/${companyId}/quotes`, {
      params: filteredParams,
    });
    return parseQuoteResponse(response.data);
  },

  getQuoteById: async (id: number): Promise<QuoteDetail> => {
    const response = await api.get(`/api/erp/quotes/${id}`);
    return parseQuoteDetail(response.data);
  },

  createQuote: async (data: QuoteDetail, companyId: number, userId: number, groupId: number): Promise<QuoteDetail> => {
    const requestData = {
      userId: userId,
      companyId: companyId,
      groupId: groupId,
      clientId: data.clientId,
      quoteNo: data.quoteNo,
      shippingAddress: data.shippingAddress,
      manager: data.manager,
      managerNumber: data.managerNumber,
      products: data.products.map((product) => ({
        quoteProductId: null,
        productId: product.id,
        price: product.price,
        count: product.count,
      })),
    }

    console.log("requestData", requestData);
    const response = await api.post<QuoteDetail>('/api/erp/quotes', requestData);
    return response.data;
  },

  updateQuote: async (data: QuoteDetail, companyId: number, userId: number, groupId: number): Promise<Quote> => {
    const requestData = {
      userId: userId,
      companyId: companyId,
      groupId: groupId,
      clientId: data.clientId,
      quoteNo: data.quoteNo,
      shippingAddress: data.shippingAddress,
      manager: data.manager,
      managerNumber: data.managerNumber,
      products: data.products.map((product) => ({
        quoteProductId: null,
        productId: product.id,
        price: product.price,
        count: product.count,
      })),
    }

    const response = await api.put<Quote>(`/api/erp/quotes/${data.id}`, requestData);
    return response.data;
  },

  deleteQuote: async (id: number): Promise<void> => {
    await api.delete(`/api/erp/quotes/${id}`);
  },

  deleteQuotes: async (ids: number[]): Promise<void> => {
    await api.post(`/api/erp/quotes/delete`, { ids });
  },
}; 
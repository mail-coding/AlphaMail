import { create } from 'zustand';
import { quoteService } from '../services/quoteService';
import { Quote, QuoteDetail, QuoteQueryParams } from '../types/quote';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

interface QuoteSearchParams {
  clientName?: string;
  quoteNo?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  productName?: string;
}

interface QuoteState {
  quotes: Quote[];
  selectedQuote: QuoteDetail | null;
  totalCount: number;
  pageCount: number;
  isLoading: boolean;
  error: string | null;
  keyword: string;
  selectedQuoteIds: Set<number>;
  currentPage: number;
  pageSize: number;
  sortOption: number;
  formData: QuoteDetail;
  setFormData: (data: QuoteDetail | ((prev: QuoteDetail) => QuoteDetail)) => void;
  fetchQuotes: (params?: QuoteQueryParams) => Promise<void>;
  fetchQuoteById: (id: number) => Promise<void>;
  deleteQuote: (id: number) => Promise<void>;
  clearError: () => void;
  setKeyword: (keyword: string) => void;
  setSelectedQuote: (quote: QuoteDetail | null) => void;
  setSelectedQuoteIds: (ids: Set<number>) => void;
  toggleQuoteSelection: (id: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSortOption: (option: number) => void;
  searchParams: QuoteSearchParams;
  setSearchParams: (params: QuoteSearchParams) => void;
  clearSelection: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  quotes: [],
  selectedQuote: null,
  totalCount: 0,
  pageCount: 0,
  isLoading: false,
  error: null,
  keyword: '',
  selectedQuoteIds: new Set(),
  currentPage: 1,
  pageSize: 10,
  sortOption: 0,
  formData: {
    id: 0,
    userId: 0,
    userName: '',
    groupId: 0,
    groupName: '',
    clientId: 0,
    clientName: '',
    manager: '',
    managerNumber: '',
    licenseNumber: '',
    businessType: '',
    businessItem: '',
    shippingAddress: '',
    quoteNo: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    representative: '',
    products: [],
  },
  
  setFormData: (data) => set((state) => ({
    formData: typeof data === 'function' ? data(state.formData) : data,
  })),

  fetchQuotes: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await quoteService.getQuotes(params);
      set({
        quotes: response.contents,
        totalCount: response.totalCount,
        pageCount: response.pageCount,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch quotes' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchQuoteById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const quote = await quoteService.getQuoteById(id);
      set({ selectedQuote: quote });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch quote' });
    } finally {
      set({ isLoading: false });
    }
  },

  createQuote: async (data: QuoteDetail) => {
    try {
      set({ isLoading: true, error: null });
      const { data: userInfo } = useUserInfo();
      if (!userInfo) throw new Error('사용자 정보를 찾을 수 없습니다.');
      
      await quoteService.createQuote(data, userInfo.companyId, userInfo.id, userInfo.groupId);
      // Refresh quotes list after creation
      const response = await quoteService.getQuotes();
      set({
        quotes: response.contents,
        totalCount: response.totalCount,
        pageCount: response.pageCount,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create quote' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuote: async (data: QuoteDetail) => {
    try {
      set({ isLoading: true, error: null });
      const { data: userInfo } = useUserInfo();
      if (!userInfo) throw new Error('사용자 정보를 찾을 수 없습니다.');
      
      await quoteService.updateQuote(data, userInfo.companyId, userInfo.id, userInfo.groupId);
      // Refresh quotes list after update
      const response = await quoteService.getQuotes();
      set({
        quotes: response.contents,
        totalCount: response.totalCount,
        pageCount: response.pageCount,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update quote' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteQuote: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await quoteService.deleteQuote(id);
      // Refresh quotes list after deletion
      const response = await quoteService.getQuotes();
      set({
        quotes: response.contents,
        totalCount: response.totalCount,
        pageCount: response.pageCount,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete quote' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  setKeyword: (keyword) => set({ keyword }),

  setSelectedQuote: (quote) => set({ selectedQuote: quote }),

  setSelectedQuoteIds: (ids) => set({ selectedQuoteIds: ids }),

  toggleQuoteSelection: (id) => 
    set((state) => {
      const newSet = new Set(state.selectedQuoteIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedQuoteIds: newSet };
    }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setPageSize: (size) => set({ pageSize: size }),

  setSortOption: (option) => set({ sortOption: option }),

  searchParams: {},

  setSearchParams: (params) => set({ searchParams: params }),

  clearSelection: () => set({ selectedQuoteIds: new Set() }),
})); 
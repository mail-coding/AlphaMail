import { create } from 'zustand';
import { quoteService } from '../services/quoteService';
import { Quote, QuoteDetail, QuoteQueryParams, CreateQuoteRequest, UpdateQuoteRequest } from '../types/quote';

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
  fetchQuotes: (params?: QuoteQueryParams) => Promise<void>;
  fetchQuoteById: (id: number) => Promise<void>;
  createQuote: (data: CreateQuoteRequest) => Promise<void>;
  updateQuote: (data: UpdateQuoteRequest) => Promise<void>;
  deleteQuote: (id: number) => Promise<void>;
  clearError: () => void;
  setKeyword: (keyword: string) => void;
  setSelectedQuote: (quote: QuoteDetail | null) => void;
  setSelectedQuoteIds: (ids: Set<number>) => void;
  toggleQuoteSelection: (id: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSortOption: (option: number) => void;
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

  fetchQuotes: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await quoteService.getQuotes(params);
      set({
        quotes: response.contents,
        totalCount: response.total_count,
        pageCount: response.page_count,
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

  createQuote: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await quoteService.createQuote(data);
      // Refresh quotes list after creation
      const response = await quoteService.getQuotes();
      set({
        quotes: response.contents,
        totalCount: response.total_count,
        pageCount: response.page_count,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create quote' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuote: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await quoteService.updateQuote(data);
      // Refresh quotes list after update
      const response = await quoteService.getQuotes();
      set({
        quotes: response.contents,
        totalCount: response.total_count,
        pageCount: response.page_count,
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
        totalCount: response.total_count,
        pageCount: response.page_count,
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
})); 
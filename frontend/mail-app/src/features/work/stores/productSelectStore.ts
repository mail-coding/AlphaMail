import { create } from 'zustand';
import { Product } from '../types/product';

interface ProductSelectState {
  products: Product[];
  searchKeyword: string;
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setSearchKeyword: (keyword: string) => void;
  setSelectedId: (id: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductSelectStore = create<ProductSelectState>((set) => ({
  products: [],
  searchKeyword: '',
  selectedId: null,
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setSelectedId: (id) => set({ selectedId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
})); 
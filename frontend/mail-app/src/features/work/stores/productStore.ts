import { create } from 'zustand';
import { Product } from '../types/product';

interface ProductState {
  // 검색 관련 상태
  keyword: string;
  setKeyword: (keyword: string) => void;
  
  // 선택된 상품 관련 상태
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // 선택된 상품 ID 목록
  selectedProductIds: Set<number>;
  setSelectedProductIds: (ids: Set<number>) => void;
  toggleProductSelection: (id: number) => void;
  
  // 페이지네이션 관련 상태
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  
  // 정렬 관련 상태
  sortOption: number;
}

export const useProductStore = create<ProductState>((set) => ({
  // 검색 관련 상태
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
  
  // 선택된 상품 관련 상태
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  // 선택된 상품 ID 목록
  selectedProductIds: new Set(),
  setSelectedProductIds: (ids) => set({ selectedProductIds: ids }),
  toggleProductSelection: (id) => 
    set((state) => {
      const newSet = new Set(state.selectedProductIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedProductIds: newSet };
    }),
  
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  sortOption: 0, 
})); 
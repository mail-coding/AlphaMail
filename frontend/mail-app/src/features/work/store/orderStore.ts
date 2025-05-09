import { create } from 'zustand';
import { OrderDetail } from '../types/order';

interface OrderStore {
  // 페이지네이션
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // 정렬
  sortOption: number;
  setSortOption: (option: number) => void;

  // 검색 파라미터
  searchParams: {
    clientName: string;
    orderNo: number;
    userName: string;
    startDate: string;
    endDate: string;
    productName: string;
  };
  setSearchParams: (params: Partial<OrderStore['searchParams']>) => void;

  // 선택된 주문
  selectedOrderIds: Set<number>;
  toggleOrderSelection: (id: number, checked: boolean) => void;
  clearSelection: () => void;

  // 상세 보기
  showOrderDetail: boolean;
  selectedOrder: OrderDetail | null;
  setShowOrderDetail: (show: boolean) => void;
  setSelectedOrder: (order: OrderDetail | null) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  // 페이지네이션
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // 정렬
  sortOption: 0,
  setSortOption: (option) => set({ sortOption: option }),

  // 검색 파라미터
  searchParams: {
    clientName: '',
    orderNo: 0,
    userName: '',
    startDate: '',
    endDate: '',
    productName: '',
  },
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  // 선택된 주문
  selectedOrderIds: new Set(),
  toggleOrderSelection: (id, checked) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedOrderIds);
      if (checked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return { selectedOrderIds: newSelectedIds };
    }),
  clearSelection: () => set({ selectedOrderIds: new Set() }),

  // 상세 보기
  showOrderDetail: false,
  selectedOrder: null,
  setShowOrderDetail: (show) => set({ showOrderDetail: show }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
})); 
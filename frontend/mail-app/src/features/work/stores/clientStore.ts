import { create } from 'zustand';
import { Client } from '../types/clients';

interface ClientState {
  selectedClient: Client | null;
  selectedClientIds: Set<number>;
  keyword: string;
  currentPage: number;
  pageSize: number;
  sortOption: number;
  companyId: number;
  setSelectedClient: (client: Client | null) => void;
  setSelectedClientIds: (ids: Set<number>) => void;
  toggleClientSelection: (id: number) => void;
  setKeyword: (keyword: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSortOption: (option: number) => void;
  setCompanyId: (id: number) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  selectedClient: null,
  selectedClientIds: new Set(),
  keyword: '',
  currentPage: 1,
  pageSize: 10,
  sortOption: 0,
  companyId: 1,

  setSelectedClient: (client) => set({ selectedClient: client }),
  setSelectedClientIds: (ids) => set({ selectedClientIds: ids }),
  toggleClientSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedClientIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return { selectedClientIds: newSet };
    }),
  setKeyword: (keyword) => set({ keyword }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setSortOption: (option) => set({ sortOption: option }),
  setCompanyId: (id) => set({ companyId: id }),
}));
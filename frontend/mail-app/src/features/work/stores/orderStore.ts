import { create } from 'zustand';
import { OrderDetail, OrderProduct } from '../types/order';

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
    clientName?: string;
    orderNo?: string;
    userName?: string;
    startDate?: string;
    endDate?: string;
    productName?: string;
  };
  setSearchParams: (params: any) => void;

  // 선택된 주문
  selectedOrderIds: Set<number>;
  toggleOrderSelection: (id: number) => void;
  clearSelection: () => void;
  setSelectedOrderIds: (ids: Set<number>) => void;

  // 상세 보기
  showOrderDetail: boolean;
  selectedOrder: OrderDetail | null;
  setShowOrderDetail: (show: boolean) => void;
  setSelectedOrder: (order: OrderDetail | null) => void;

  // 폼 데이터 관리
  formData: OrderDetail | null;
  setFormData: (data: OrderDetail | null) => void;
  updateFormField: <K extends keyof OrderDetail>(field: K, value: OrderDetail[K]) => void;
  updateProduct: (index: number, field: keyof OrderProduct, value: string | number) => void;
  addProduct: () => void;
  removeProduct: (index: number) => void;
}

const initialFormData: OrderDetail = {
  id: 0,
  userId: 0,
  userName: '',
  groupId: 0,
  groupName: '',
  clientId: 0,
  clientName: '',
  licenseNumber: '',
  representative: '',
  businessType: '',
  businessItem: '',
  manager: '',
  managerNumber: '',
  paymentTerm: '',
  shippingAddress: '',
  orderNo: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  deliverAt: new Date(),
  products: [{
    id: 0,
    name: '',
    standard: '',
    count: 0,
    price: 0,
    tax_amount: 0,
    supply_amount: 0,
    amount: 0
  }]
};

export const useOrderStore = create<OrderStore>()((set) => ({
  // 페이지네이션
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // 정렬
  sortOption: 0,
  setSortOption: (option) => set({ sortOption: option }),

  // 검색 파라미터
  searchParams: {},
  setSearchParams: (params) => set({ searchParams: params }),

  // 선택된 주문
  selectedOrderIds: new Set(),
  toggleOrderSelection: (id) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedOrderIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return { selectedOrderIds: newSelectedIds };
    }),
  clearSelection: () => set({ selectedOrderIds: new Set() }),
  setSelectedOrderIds: (ids) => set({ selectedOrderIds: ids }),

  // 상세 보기
  showOrderDetail: false,
  selectedOrder: null,
  setShowOrderDetail: (show) => set({ showOrderDetail: show }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  // 폼 데이터 관리
  formData: null,
  setFormData: (data) => set({ formData: data }),
  updateFormField: (field, value) => 
    set((state) => {
      const newFormData = state.formData ? { ...state.formData } : { ...initialFormData };
      newFormData[field] = value;
      return { formData: newFormData };
    }),
  updateProduct: (index, field, value) =>
    set((state) => {
      if (!state.formData) {
        return { formData: initialFormData };
      }
      const newProducts = [...state.formData.products];
      newProducts[index] = {
        ...newProducts[index],
        [field]: value,
      };
      if (field === 'count' || field === 'price') {
        newProducts[index].amount = newProducts[index].count * newProducts[index].price;
      }
      return { formData: { ...state.formData, products: newProducts } };
    }),
  addProduct: () =>
    set((state) => {
      if (!state.formData) {
        return { formData: initialFormData };
      }
      const newProduct: OrderProduct = {
        id: 0,
        name: '',
        standard: '',
        count: 0,
        price: 0,
        tax_amount: 0,
        supply_amount: 0,
        amount: 0
      };
      return { formData: { ...state.formData, products: [...state.formData.products, newProduct] } };
    }),
  removeProduct: (index) =>
    set((state) => {
      if (!state.formData) {
        return { formData: initialFormData };
      }
      return { formData: { ...state.formData, products: state.formData.products.filter((_, i) => i !== index) } };
    }),
}));
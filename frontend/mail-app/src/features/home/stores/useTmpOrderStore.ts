import { create } from 'zustand';
import { TemporaryPurchaseOrderDetail } from '../types/home';

interface TmpOrderState {
  // 기본 정보
  orderNo: string;
  orderDate: string;
  
  // 거래처 정보
  clientId: number | null;
  clientName: string;
  licenseNumber: string;
  representative: string;
  businessType: string;
  businessItem: string;
  
  // 담당자 정보
  manager: string;
  managerContact: string;
  clientContact: string;
  setClientContact: (contact: string) => void;

  // 결제 조건
  paymentTerm: string;
  
  // 배송 정보
  shippingAddress: string;
  hasShippingAddress: boolean;
  
  // 납기일자
  deliverAt: string;
  
  // 품목 정보
  products: {
    id: number;
    productId: number | null;
    productName: string;
    standard?: string;
    price?: number;
    count: number;
    maxStock?: number;
  }[];
  
  // 액션
  setClientInfo: (info: {
    clientId: number | null;
    clientName: string;
    licenseNumber: string;
    representative: string;
    businessType: string;
    businessItem: string;
  }) => void;
  setManager: (manager: string) => void;
  setManagerContact: (contact: string) => void;
  setPaymentTerm: (term: string) => void;
  setShippingAddress: (address: string) => void;
  setHasShippingAddress: (has: boolean) => void;
  setDeliverAt: (date: string) => void;
  setProducts: (products: {
    id: number;
    productId: number | null;
    productName: string;
    standard?: string;
    price?: number;
    count: number;
    maxStock?: number;
  }[]) => void;
  reset: () => void;
  
  // API 응답으로부터 스토어 상태 설정
  setFromApiResponse: (data: TemporaryPurchaseOrderDetail) => void;
}

export const useTmpOrderStore = create<TmpOrderState>((set, get) => ({
  // 기본 정보
  orderNo: '자동생성',
  orderDate: new Date().toISOString().split('T')[0],
  
  // 거래처 정보
  clientId: null,
  clientName: '',
  clientContact: '',

  licenseNumber: '',
  representative: '',
  businessType: '',
  businessItem: '',
  
  // 담당자 정보
  manager: '',
  managerContact: '',
  
  // 결제 조건
  paymentTerm: '',
  
  // 배송 정보
  shippingAddress: '',
  hasShippingAddress: false,
  
  // 납기일자
  deliverAt: '',
  
  // 품목 정보
  products: [],
  
  // 액션
  setClientInfo: (info) => set(info),
  setManager: (manager) => set({ manager }),
  setManagerContact: (contact) => set({ managerContact: contact }),
  setClientContact: (contact: string) => set({ clientContact: contact }),
  setPaymentTerm: (term) => set({ paymentTerm: term }),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setHasShippingAddress: (has) => set({ hasShippingAddress: has }),
  setDeliverAt: (date) => set({ deliverAt: date }),
  setProducts: (products) => set({ products }),
  
  reset: () => set({
    orderNo: '자동생성',
    orderDate: new Date().toISOString().split('T')[0],
    clientId: null,
    clientName: '',
    licenseNumber: '',
    representative: '',
    businessType: '',
    businessItem: '',
    manager: '',
    managerContact: '',
    paymentTerm: '',
    shippingAddress: '',
    hasShippingAddress: false,
    deliverAt: '',
    products: []
  }),
  
  // API 응답으로부터 스토어 상태 설정
  setFromApiResponse: (data) => {
    if (!data) return;
    
    set({
      orderNo: `PO-${data.id}`,
      orderDate: data.createdAt ? data.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      
      // 거래처 정보 설정 - 추가 필드 포함
      clientId: data.client?.clientId || null,
      clientName: data.client?.clientName || data.clientName || '', // 검색된 거래처명 우선
      licenseNumber: data.client?.licenseNum || '', // 추가 필드
      representative: data.client?.representative || '', // 추가 필드
      businessType: data.client?.businessType || '', // 추가 필드
      businessItem: data.client?.businessItem || '', // 추가 필드
      
      // 담당자 정보
      manager: data.userName || '', // 발주 담당자는 유저의 이름
      managerContact: data.manager || '', // 거래처 담당자
      clientContact: data.managerNumber || '', // 거래처 연락처
      
      // 결제 조건
      paymentTerm: data.paymentTerm || '',
      
      // 배송 정보
      shippingAddress: data.shippingAddress || '',
      hasShippingAddress: data.hasShippingAddress || false,
      
      // 납기일자
      deliverAt: data.deliverAt ? data.deliverAt.split('T')[0] : '',
      
      // 품목 정보
      products: data.products ? data.products.map((item) => {
        // 서버에서 product 객체가 null인 경우, 기존 products 배열에서 해당 제품 정보 찾기
        const existingProduct = get().products.find(p => 
          p.productName === item.productName || 
          (item.product?.productId && p.productId === item.product.productId)
        );
        
        return {
          id: item.id,
          productId: item.product?.productId || existingProduct?.productId || null,
          productName: item.product?.name || item.productName || '',
          standard: item.product?.standard || existingProduct?.standard || '',
          price: item.product?.inboundPrice || existingProduct?.price || 0,
          count: item.count || 0,
          maxStock: item.product?.stock || existingProduct?.maxStock || 0
        };
      }) : []
    });
  }
}));
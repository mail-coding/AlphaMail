import { create } from 'zustand';

interface Product {
  id?: number;
  productId?: number | null;
  productName?: string;
  standard?: string;
  count?: number;
  price?: number;
  maxStock?: number;
}

interface TmpQuoteStore {
  // 견적서 기본 정보
  quoteNo: string;
  quoteDate: string;
  clientName: string;
  licenseNumber: string;
  representative: string;
  businessType: string;
  businessItem: string;
  address: string;
  manager: string;
  managerContact: string;
  validityPeriod: string;
  deliveryDate: string;
  shippingAddress: string;
  clientId: number | null;

  // 품목 목록
  products: Product[];
  
  // 액션
  setClientId: (id: number | null) => void;
  setClientName: (name: string) => void;
  setLicenseNumber: (licenseNumber: string) => void;
  setRepresentative: (representative: string) => void;
  setBusinessType: (businessType: string) => void;
  setBusinessItem: (businessItem: string) => void;
  setAddress: (address: string) => void;
  setManager: (manager: string) => void;
  setManagerContact: (managerContact: string) => void;
  setValidityPeriod: (validityPeriod: string) => void;
  setDeliveryDate: (deliveryDate: string) => void;
  setShippingAddress: (address: string) => void;
  
  // 품목 관련 액션
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  removeProduct: (id: number) => void;

  // 합계 계산
  getTotalAmount: () => number;
  
  // 초기화
  reset: () => void;
  initFromApiData: (data: any) => void;
}

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 견적서 번호 생성 함수
const generateQuoteNo = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `QT-${year}${month}${day}-${random}`;
};

export const useTmpQuoteStore = create<TmpQuoteStore>((set, get) => ({
  // 초기 상태
  quoteNo: generateQuoteNo(),
  quoteDate: getCurrentDate(),
  clientId: null,
  clientName: '',
  licenseNumber: '',
  representative: '',
  businessType: '',
  businessItem: '',
  address: '',
  manager: '',
  managerContact: '',
  validityPeriod: '견적일로부터 30일',
  deliveryDate: '',
  shippingAddress: '',
  products: [],
  
  // 액션
  setClientId: (id: number | null) => set({ clientId: id }),
  setClientName: (name: string) => set({ clientName: name }),
  setLicenseNumber: (licenseNumber: string) => set({ licenseNumber }),
  setRepresentative: (representative: string) => set({ representative }),
  setBusinessType: (businessType: string) => set({ businessType }),
  setBusinessItem: (businessItem: string) => set({ businessItem }),
  setAddress: (address: string) => set({ address }),
  setManager: (manager: string) => set({ manager }),
  setManagerContact: (managerContact: string) => set({ managerContact }),
  setValidityPeriod: (validityPeriod: string) => set({ validityPeriod }),
  setDeliveryDate: (deliveryDate: string) => set({ deliveryDate }),
  setShippingAddress: (address: string) => set({ shippingAddress: address }),
  
  // 품목 관련 액션
  setProducts: (products: Product[]) => set({ products }),
  addProduct: (product: Product) => {
    const { products } = get();
    const newId = products.length > 0 
      ? Math.max(...products.map(p => (p.id || 0))) + 1 
      : 1;
    
    // 수량 제한 확인
    const count = product.count || 0;
    const maxStock = product.maxStock || 0;
    
    // 수량이 재고보다 많으면 재고량으로 제한
    const limitedCount = maxStock > 0 ? Math.min(count, maxStock) : count;
    
    set({ 
      products: [
        ...products, 
        { 
          ...product, 
          id: newId,
          count: limitedCount 
        }
      ] 
    });
  },
  updateProduct: (id: number, product: Partial<Product>) => {
    const { products } = get();
    
    // 수량 제한 확인
    if (product.count !== undefined) {
      const existingProduct = products.find(p => p.id === id);
      const maxStock = existingProduct?.maxStock || 0;
      
      // 수량이 재고보다 많으면 재고량으로 제한
      if (maxStock > 0 && product.count > maxStock) {
        product.count = maxStock;
      }
    }
    
    set({
      products: products.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
    });
  },

  removeProduct: (id: number) => {
    const { products } = get();
    set({ products: products.filter(p => p.id !== id) });
  },
  
  // 합계 계산
  getTotalAmount: () => {
    const { products } = get();
    return products.reduce((sum, product) => {
      const total = (product.price || 0) * (product.count || 0);
      return sum + total;
    }, 0);
  },
  
  // 초기화
  reset: () => {
    set({
      quoteNo: generateQuoteNo(),
      quoteDate: getCurrentDate(),
      clientId: null,
      clientName: '',
      licenseNumber: '',
      representative: '',
      businessType: '',
      businessItem: '',
      address: '',
      manager: '',
      managerContact: '',
      validityPeriod: '견적일로부터 30일',
      deliveryDate: '',
      shippingAddress: '',
      products: [],
    });
  },

  // API 데이터로 스토어 초기화
  initFromApiData: (data) => {
    if (!data) return;
    
    // 거래처 정보 설정
    const clientId = data.client?.clientId || null;
    const clientName = clientId ? data.client?.clientName : data.clientName || '';
    
    // 품목 정보 변환 - API 응답 구조에 맞게 수정
    const products = data.products?.map((item: any) => ({
      id: item.id,
      // product 객체가 있는 경우 해당 정보 사용
      productId: item.product?.productId || item.productId || null,
      productName: item.product?.name || item.productName || '',
      standard: item.product?.standard || item.standard || '',
      price: item.product?.inboundPrice || item.price || 0,
      count: item.count || 0,
      maxStock: item.product?.stock || 0
    })) || [];
    
    set({
      clientId,
      clientName,
      manager: data.manager || '',
      managerContact: data.managerNumber || '',
      shippingAddress: data.shippingAddress || '',
      products,
    });
  }
}));
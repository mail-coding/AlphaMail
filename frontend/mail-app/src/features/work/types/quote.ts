export interface Quote {
  id: number;
  quoteNo: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  clientName: string;
  productCount: number;
  productName: string;
  price: number;
  isSelected?: boolean;
}

export const parseQuote = (data: any): Quote => ({
  ...data,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
});

export interface QuoteDetail {
  id: number;
  userId: number;
  userName: string;
  groupId: number;
  groupName: string;
  clientId: number;
  clientName: string;
  manager: string;
  managerNumber: string;
  licenseNumber: string;
  businessType: string;
  businessItem: string;
  shippingAddress: string;
  quoteNo: string;
  createdAt: Date;
  updatedAt: Date;
  representative: string;
  products: QuoteProduct[];
}

export const parseQuoteDetail = (data: any): QuoteDetail => ({
  ...data,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
  products: data.products.map(parseQuoteProduct),
});

export interface QuoteProduct {
  id: number;
  name: string;
  standard: string;
  count: number;
  price: number;
  deletedAt: Date | null;
}

export const parseQuoteProduct = (data: any): QuoteProduct => ({
  ...data,
  deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
});

export interface QuoteResponse {
  contents: Quote[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

export const parseQuoteResponse = (data: any): QuoteResponse => ({
  contents: data.contents.map(parseQuote),
  totalCount: data.totalCount,
  pageCount: data.pageCount,
  currentPage: data.currentPage,
});

export interface QuoteQueryParams {
  page?: number;
  size?: number;
  clientName?: string;
  orderNo?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  productName?: string;
} 
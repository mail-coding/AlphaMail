export interface Product {
  id: number;
  name: string;
  standard: string;
  stock: number;
  inboundPrice: number;
  outboundPrice: number;
  image?: string;
  isSelected?: boolean;
}

export interface ProductSearchParams {
  keyword: string;
}

export interface ProductListResponse {
  contents: Product[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

export interface CreateProductRequest {
  name: string;
  standard: string;
  stock: number;
  inboundPrice: number;
  outboundPrice: number;
  image?: string;
  companyId: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export type ProductResponse = ProductListResponse; 
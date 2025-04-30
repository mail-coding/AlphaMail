export interface Product {
  id: number;
  name: string;
  quantity: string;
  grade: string;
  stock: number;
  purchasePrice: number;
  sellingPrice: number;
  description?: string;
  isSelected?: boolean;
}

export interface ProductSearchParams {
  keyword: string;
} 
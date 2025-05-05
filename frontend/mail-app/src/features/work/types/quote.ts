export interface Quote {
  id: number;
  quote_no: string;
  created_at: string;
  user_name: string;
  client_name: string;
  product_count: number;
  product_name: string;
  price: number;
  isSelected?: boolean;
}

export interface QuoteDetail {
  quote_no: string;
  order_no: string;
  date: string;
  client_name: string;
  business_no: string;
  representative: string;
  business_type: string;
  business_category: string;
  manager: string;
  client_manager: string;
  client_contact: string;
  payment_condition: string;
  delivery_date: string;
  address: string;
  products: QuoteProduct[];
}

export interface QuoteProduct {
  id?: number;
  name: string;
  standard: string;
  quantity: number;
  unit_price: number;
  tax_amount: number;
  supply_amount: number;
  amount: number;
}

export interface QuoteResponse {
  contents: Quote[];
  total_count: number;
  page_count: number;
}

export interface CreateQuoteRequest {
  client_name: string;
  business_no: string;
  representative: string;
  business_type: string;
  business_category: string;
  manager: string;
  client_manager: string;
  client_contact: string;
  payment_condition: string;
  delivery_date: string;
  address: string;
  products: Omit<QuoteProduct, 'id'>[];
}

export interface UpdateQuoteRequest extends Partial<CreateQuoteRequest> {
  id: number;
}

export interface QuoteQueryParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
} 
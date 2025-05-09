export interface Order {
  id: number;
  orderNo: string;
  createdAt: Date;
  userName: string;
  clientName: string;
  deliverAt: Date;
  productName: string;
  productCount: number;
  price: number;
  isSelected?: boolean;
}

export interface OrderSearchParams {
  client_name?: string;
  client_or_biz_no?: string;
  order_no?: string;
  manager?: string;
  order_date_from?: string;
  order_date_to?: string;
  item?: string;
  search?: string;
}

export interface OrderListResponse {
  contents: Array<{
    id: number;
    orderNo: string;
    createdAt: Date;
    userName: string;
    clientName: string;
    deliverAt: Date;
    productName: string;
    productCount: number;
    price: number;
  }>;
  totalCount: number;
  pageCount: number;
  currentPage: number;
}

export interface OrderDetail {
  order_no: string;
  date: string;
  is_inbound: boolean;
  manager: string;
  client_name: string;
  business_no: string;
  representative: string;
  business_type: string;
  business_category: string;
  client_manager: string;
  client_contact: string;
  payment_condition: string;
  due_date: string;
  address: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  name: string;
  standard: string;
  quantity: number;
  unit_price: number;
  tax_amount: number;
  supply_amount: number;
  amount: number;
} 
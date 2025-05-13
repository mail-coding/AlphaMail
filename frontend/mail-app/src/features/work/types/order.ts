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
  id: number;
  userId: number;
  userName: string;
  groupId: number;
  groupName: string;
  clientId: number;
  clientName: string;
  licenseNumber: string;
  representative: string;
  businessType: string;
  businessItem: string;
  manager: string;
  managerNumber: string;
  paymentTerm: string;
  shippingAddress: string;
  orderNo: string;
  createdAt: Date;
  updatedAt: Date;
  deliverAt: Date;
  products: OrderProduct[];
}

export interface OrderProduct {
  id: number;
  name: string;
  standard: string;
  count: number;
  price: number;
  tax_amount: number;
  supply_amount: number;
  amount: number;
  deletedAt?: Date | null;
} 
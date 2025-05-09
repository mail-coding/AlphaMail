import { OrderDetail, Order } from '../types/order';
import { api } from '../../../shared/lib/axiosInstance';

interface OrderService {
  getOrders: (companyId: number, params: {
    page: number;
    size: number;
    clientName?:string;
    orderNo?:number;
    userName?:string;
    startDate?:string;
    endDate?:string;
    productName?:string;
  }) => Promise<{
    content: Order[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }>;
  getOrderDetail: (orderId: number) => Promise<any>;
  createOrder: (orderData: OrderDetail) => Promise<any>;
  updateOrder: (orderId: number, orderData: OrderDetail) => Promise<any>;
  deleteOrders: (orderIds: number[]) => Promise<any>;
  saveOrder: (params: { orderData: OrderDetail; orderId?: number }) => Promise<any>;
}

export const orderService: OrderService = {
  getOrders: async (companyId: number, params: {
    page: number;
    size: number;
    clientName?:string;
    orderNo?:number;
    userName?:string;
    startDate?:string;
    endDate?:string;
    productName?:string;
  }) => {
    const response = await api.get(`/api/erp/companies/${companyId}/purchase-orders`, { params });
    

    const orders: Order[] = (response.data?.contents || []).map((order:any) => ({
      id: order.id,
      orderNo: order.orderNo,
      createdAt: new Date(order.createdAt),
      userName: order.userName,
      clientName: order.clientName,
      deliverAt: new Date(order.deliverAt),
      productName: order.productName,
      productCount: order.productCount,
      price: order.price,
      isSelected: false,
    }));

    return {
      content: orders,
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      size: response.data.size,
      number: response.data.number,
    };
  },

  getOrderDetail: async (orderId: number) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  createOrder: async (orderData: OrderDetail) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  updateOrder: async (orderId: number, orderData: OrderDetail) => {
    const response = await api.put(`/api/orders/${orderId}`, orderData);
    return response.data;
  },

  deleteOrders: async (orderIds: number[]) => {
    const response = await api.delete('/api/orders', {
      data: { orderIds },
    });
    return response.data;
  },

  saveOrder: async ({ orderData, orderId }: { orderData: OrderDetail; orderId?: number }) => {
    if (orderId) {
      return orderService.updateOrder(orderId, orderData);
    } else {
      return orderService.createOrder(orderData);
    }
  },
}; 
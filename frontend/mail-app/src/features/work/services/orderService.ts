import { OrderDetail, Order, OrderProduct } from '../types/order';
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
  updateOrder: (orderData: OrderDetail) => Promise<any>;
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

    const order: Order[] = (response.data || []).map((order:any) => ({
      id: order.id,
      userId: order.userId,
      userName: order.userName,
      groupId: order.groupId,
      groupName: order.groupName,
      clientId: order.clientId,
      clientName: order.clientName,
      licenseNumber: order.licenseNumber,
      representative: order.representative,
      businessType: order.businessType,
      businessItem: order.businessItem,
      manager: order.manager,
      managerNumber: order.managerNumber,
      paymentTerm: order.paymentTerm,
      shippingAddress: order.shippingAddress,
      orderNo: order.orderNo,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      deliveryAt: new Date(order.deliveryAt),
      products: (order.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        standard: product.standard,
        count: product.count,
        price: product.price,
        tax_amount: product.tax_amount,
        supply_amount: product.supply_amount,
        deletedAt: product.deletedAt ? new Date(product.deletedAt) : null,
      })),
    }));
    return order;
  },

  createOrder: async (orderData: OrderDetail) => {
    const requestData = {
      userId: 1, // TODO: 로그인된 아이디의 아이디 추가
      companyId: 1, // TODO: 로그인된 아이디의 회사 아이디 추가
      groupId: orderData.groupId,
      clientId: orderData.clientId,
      orderNo: orderData.orderNo,
      deliveryAt: orderData.deliveryAt,
      shippingAddress: orderData.shippingAddress,
      manager: orderData.manager,
      managerNumber: orderData.managerNumber,
      paymentTerm: orderData.paymentTerm,
      products: (orderData.products || []).map((product: OrderProduct) => ({
        productId: product.id,
        count: product.count,
        price: product.price
      })),
    };
    
    const response = await api.post('/api/orders', requestData);
    return response.data;
  },

  updateOrder: async (orderData: OrderDetail) => {
    const requestData = {
      userId: 1, // TODO: 로그인된 아이디의 아이디 추가
      companyId: 1, // TODO: 로그인된 아이디의 회사 아이디 추가
      groupId: orderData.groupId,
      clientId: orderData.clientId,
      orderNo: orderData.orderNo,
      deliveryAt: orderData.deliveryAt,
      shippingAddress: orderData.shippingAddress,
      manager: orderData.manager,
      managerNumber: orderData.managerNumber,
      paymentTerm: orderData.paymentTerm,
      products: (orderData.products || []).map((product: OrderProduct) => ({
        productId: product.id,
        count: product.count,
        price: product.price
      })),
    };
    
    const response = await api.put(`/api/orders/${orderData.id}`, requestData);
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
      return orderService.updateOrder(orderData);
    } else {
      return orderService.createOrder(orderData);
    }
  },
}; 
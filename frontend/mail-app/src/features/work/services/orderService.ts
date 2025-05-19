import { OrderDetail, Order, OrderProduct } from '../types/order';
import { api } from '../../../shared/lib/axiosInstance';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

interface OrderService {
  getOrders: (companyId: number, params: {
    page: number;
    size: number;
    clientName?:string;
    orderNo?:string;
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
  createOrder: (orderData: OrderDetail, userId: number, companyId: number, groupId: number) => Promise<any>;
  updateOrder: (orderData: OrderDetail, userId: number, companyId: number, groupId: number) => Promise<any>;
  deleteOrders: (orderIds: number[]) => Promise<any>;
  saveOrder: (params: { orderData: OrderDetail; orderId?: number }) => Promise<any>;
}

export const orderService: OrderService = {
  getOrders: async (companyId: number, params: {
    page: number;
    size: number;
    clientName?:string;
    orderNo?:string;
    userName?:string;
    startDate?:string;
    endDate?:string;
    productName?:string;
  }) => {
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    console.log(filteredParams);
    const response = await api.get(`/api/erp/companies/${companyId}/purchase-orders`, { params: filteredParams });

    console.log(response);
    
    const orders: Order[] = (response.data?.contents || []).map((order:any) => ({
      id: order.id,
      orderNo: order.orderNo,
      createdAt: new Date(order.createdAt + "Z"),
      userName: order.userName,
      clientName: order.clientName,
      deliverAt: new Date(order.deliverAt + "Z"),
      productName: order.productName,
      productCount: order.productCount,
      price: order.price,
      isSelected: false,
    }));

    console.log(orders);

    return {
      content: orders,
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      size: response.data.size,
      number: response.data.number,
    };
  },

  getOrderDetail: async (orderId: number) => {
    const response = await api.get(`/api/erp/purchase-orders/${orderId}`);

    const order: OrderDetail = {
      id: response.data.id,
      userId: response.data.userId,
      userName: response.data.userName,
      groupId: response.data.groupId,
      groupName: response.data.groupName,
      clientId: response.data.clientId,
      clientName: response.data.clientName,
      licenseNumber: response.data.licenseNumber,
      representative: response.data.representative,
      businessType: response.data.businessType,
      businessItem: response.data.businessItem,
      manager: response.data.manager,
      managerNumber: response.data.managerNumber,
      paymentTerm: response.data.paymentTerm,
      shippingAddress: response.data.shippingAddress,
      orderNo: response.data.orderNo,
      createdAt: new Date(response.data.createdAt + "Z"),
      updatedAt: new Date(response.data.updatedAt + "Z"),
      deliverAt: new Date(response.data.deliverAt + "Z"),
      products: (response.data.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        standard: product.standard,
        count: product.count,
        price: product.price,
        tax_amount: product.tax_amount,
        supply_amount: product.supply_amount,
        deletedAt: product.deletedAt ? new Date(product.deletedAt) : null,
      })),
    };

    console.log(order);
    return order;
  },

  createOrder: async (orderData: OrderDetail, userId: number, companyId: number, groupId: number) => {
    const requestData = {
      userId,
      companyId,
      groupId,
      clientId: orderData.clientId,
      orderNo: orderData.orderNo,
      deliverAt: orderData.deliverAt.toISOString(),
      shippingAddress: orderData.shippingAddress,
      manager: orderData.manager,
      managerNumber: orderData.managerNumber,
      paymentTerm: orderData.paymentTerm,
      products: (orderData.products || []).map((product: OrderProduct) => ({
        purchaseOrderId: null,
        productId: product.id,
        count: product.count,
        price: product.price
      })),
    };

    console.log(requestData);
    
    const response = await api.post('/api/erp/purchase-orders', requestData);
    return response.data;
  },

  updateOrder: async (orderData: OrderDetail, userId: number, companyId: number, groupId: number) => {
    const requestData = {
      userId: userId,
      companyId: companyId,
      groupId: groupId,
      clientId: orderData.clientId,
      orderNo: orderData.orderNo,
      deliverAt: orderData.deliverAt.toISOString(),
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
    const response = await api.put(`/api/erp/purchase-orders/${orderData.id}`, requestData);
    return response.data;
  },

  deleteOrders: async (orderIds: number[]) => {
    const response = await api.post('/api/erp/purchase-orders/delete', {
      ids: orderIds
    });
    return response.data;
  },

  saveOrder: async ({ orderData, orderId }: { orderData: OrderDetail; orderId?: number }) => {
    const { data: userInfo } = useUserInfo();
      
    if (!userInfo) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    if (orderId) {
      return orderService.updateOrder(orderData, userInfo.id, userInfo.companyId, userInfo.groupId);
    } else {
      return orderService.createOrder(orderData, userInfo.id, userInfo.companyId, userInfo.groupId);
    }
  },
}; 
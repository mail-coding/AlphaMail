import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { OrderDetail } from '../types/order';
import { useUserStore } from '@/shared/stores/useUserStore';

export const useOrderDetail = (orderId: number | null) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useQuery<OrderDetail>({
    queryKey: ['orderDetail', orderId],
    queryFn: () => orderService.getOrderDetail(orderId!),
    enabled: isAuthenticated && orderId !== null,
  });
}; 
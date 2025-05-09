import { useOrderStore } from '../store/orderStore';
import { orderService } from '../services/orderService';
import { OrderDetail } from '../types/order';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useOrderManagement = () => {
  const queryClient = useQueryClient();
  const { 
    currentPage, 
    pageSize, 
    sortOption,
    searchParams,
    selectedOrderIds,
    clearSelection 
  } = useOrderStore();

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['orders', currentPage, pageSize, sortOption, searchParams],
    queryFn: async () => {
      const response = await orderService.getOrders(1, {
        page: currentPage - 1,
        size: pageSize,
        ...searchParams,
      });

      // isSelected 상태 업데이트
      const ordersWithSelection = response.content.map(order => ({
        ...order,
        isSelected: selectedOrderIds.has(order.id),
      }));

      return {
        ...response,
        content: ordersWithSelection,
      };
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: orderService.deleteOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      clearSelection();
    },
  });

  const saveOrderMutation = useMutation({
    mutationFn: orderService.saveOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleDeleteOrders = async () => {
    if (selectedOrderIds.size === 0) {
      throw new Error('No orders selected for deletion');
    }
    await deleteOrderMutation.mutateAsync(Array.from(selectedOrderIds));
  };

  const handleSaveOrder = async (orderData: OrderDetail, orderId?: number) => {
    await saveOrderMutation.mutateAsync({ orderData, orderId });
  };

  return {
    orders: ordersData?.content || [],
    totalPages: ordersData?.totalPages || 0,
    totalElements: ordersData?.totalElements || 0,
    isLoading,
    error,
    handleDeleteOrders,
    handleSaveOrder,
  };
}; 
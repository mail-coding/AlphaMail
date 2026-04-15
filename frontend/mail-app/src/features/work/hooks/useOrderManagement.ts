import { useOrderStore } from '../stores/orderStore';
import { orderService } from '../services/orderService';
import { OrderDetail } from '../types/order';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useUserStore } from '@/shared/stores/useUserStore';

export const useOrderManagement = () => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
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
      if (!userInfo?.companyId) {
        throw new Error('Company ID is not available');
      }

      const params: any = {
        page: currentPage - 1, // API는 0-based index를 사용하므로 1을 빼줍니다
        size: pageSize,
        ...searchParams,
      };

      if (searchParams.startDate) {
        params.startDate = new Date(searchParams.startDate).toISOString();
      }
      if (searchParams.endDate) {
        params.endDate = new Date(searchParams.endDate).toISOString();
      }

      const response = await orderService.getOrders(userInfo.companyId, params);

      // isSelected 상태 업데이트
      const ordersWithSelection = response.contents.map(order => ({
        ...order,
        isSelected: selectedOrderIds.has(order.id),
      }));

      return {
        ...response,
        contents: ordersWithSelection,
      };
    },
    enabled: isAuthenticated,
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
    orders: ordersData?.contents || [],
    totalPages: ordersData?.pageCount || 0,
    totalElements: ordersData?.totalCount || 0,
    currentPage: ordersData?.currentPage || 1,
    isLoading,
    error,
    handleDeleteOrders,
    handleSaveOrder,
  };
}; 
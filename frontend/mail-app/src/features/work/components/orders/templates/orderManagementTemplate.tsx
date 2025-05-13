import OrderSearchBar from '../organisms/orderSearchBar';
import OrderTable from '../organisms/orderTable';
import { Order } from '../../../types/order';
import OrderDetailTemplate from './orderDetailTemplate';
import { OrderDetail } from '../../../types/order';
import { orderService } from '../../../services/orderService';
import { useOrderStore } from '../../../stores/orderStore';
import { useOrderManagement } from '../../../hooks/useOrderManagement';

async function orderToOrderDetail(order: Order): Promise<OrderDetail> {
  const orderDetail = await orderService.getOrderDetail(order.id);
  return orderDetail;
}

const OrderManagementTemplate: React.FC = () => {
  const {
    selectedOrderIds,
    currentPage,
    pageSize,
    sortOption,
    showOrderDetail,
    selectedOrder,
    setCurrentPage,
    setPageSize,
    setSortOption,
    setShowOrderDetail,
    setSelectedOrder,
    setSearchParams,
  } = useOrderStore();

  const { orders, totalPages, isLoading, error, handleDeleteOrders, handleSaveOrder } = useOrderManagement();

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setShowOrderDetail(true);
  };

  const handleDelete = () => {
    if (selectedOrderIds.size === 0) {
      alert('삭제할 발주서를 선택해주세요.');
      return;
    }
    if (window.confirm('선택한 발주서를 삭제하시겠습니까?')) {
      handleDeleteOrders();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSortChange = (option: number) => {
    setSortOption(option);
  };

  const handleOrderClick = async (order: Order) => {
    const orderDetail = await orderToOrderDetail(order);
    setSelectedOrder(orderDetail);
    setShowOrderDetail(true);
  };

  const handleBack = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleSave = (orderData: OrderDetail) => {
    handleSaveOrder(orderData);
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  if (showOrderDetail) {
    return (
      <OrderDetailTemplate
        order={selectedOrder}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <OrderSearchBar onSearch={handleSearch} />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleAddOrder}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              발주서 등록
            </button>
            <div className="space-x-2">
              <button
                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                출력
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                삭제
              </button>
            </div>
          </div>
          <OrderTable
            orders={orders}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onSizeChange={handleSizeChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            totalCount={orders.length}
            onOrderClick={handleOrderClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderManagementTemplate; 
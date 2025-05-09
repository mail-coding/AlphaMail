import OrderSearchBar from '../organisms/orderSearchBar';
import OrderTable from '../organisms/orderTable';
import { Order } from '../../../types/order';
import OrderDetailTemplate from './orderDetailTemplate';
import { OrderDetail } from '../../../types/order';
import { useOrderStore } from '../../../store/orderStore';
import { useOrderManagement } from '../../../hooks/useOrderManagement';

function orderToOrderDetail(order: Order): OrderDetail {
  return {
    order_no: order.orderNo,
    date: order.createdAt.toISOString(),
    is_inbound: false,
    manager: order.userName,
    client_name: order.clientName,
    business_no: '',
    representative: '',
    business_type: '',
    business_category: '',
    client_manager: '',
    client_contact: '',
    payment_condition: '',
    due_date: order.deliverAt.toISOString(),
    address: '',
    products: [
      {
        name: order.productName,
        standard: '',
        quantity: order.productCount,
        unit_price: order.price,
        tax_amount: 0,
        supply_amount: 0,
        amount: order.price,
      },
    ],
  };
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
    toggleOrderSelection,
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

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(orderToOrderDetail(order));
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
            onSelect={toggleOrderSelection}
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
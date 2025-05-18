import { useNavigate } from 'react-router-dom';
import OrderSearchBar from '../organisms/orderSearchBar';
import OrderTable from '../organisms/orderTable';
import { Order } from '../../../types/order';
import { useOrderStore } from '../../../stores/orderStore';
import { useOrderManagement } from '../../../hooks/useOrderManagement';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';

const OrderManagementTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedOrderIds,
    currentPage,
    pageSize,
    sortOption,
    setCurrentPage,
    setPageSize,
    setSortOption,
    setSearchParams,
    setSelectedOrderIds,
  } = useOrderStore();

  const { orders, isLoading, error, handleDeleteOrders } = useOrderManagement();

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handleAddOrder = () => {
    navigate('/work/orders/new');
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
    navigate(`/work/orders/${order.id}`);
  };

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
            <Button
              onClick={handleAddOrder}
              variant="text"
              size="large"
              className="flex items-baseline gap-2 p-0 bg-transparent shadow-none border-none text-black font-bold text-xl hover:bg-transparent hover:text-black active:bg-transparent"
            >
              <span className="text-2xl font-bold leading-none relative -top-[-1px]">+</span>
              <Typography variant="titleSmall" className="leading-none">발주서 등록하기</Typography>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                variant="text"
                size="small"
                className="min-w-[110px] h-[40px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
              >
                <Typography variant="titleSmall">삭제</Typography>
              </Button>
            </div>
          </div>
          <OrderTable
            orders={orders}
            currentPage={currentPage}
            totalPages={Math.ceil(orders.length / pageSize)}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onSizeChange={handleSizeChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            totalCount={orders.length}
            onOrderClick={handleOrderClick}
            isLoading={isLoading}
            selectedOrderIds={selectedOrderIds}
            onSelectOrder={(id) => {
              const newSelectedIds = new Set(selectedOrderIds);
              if (newSelectedIds.has(id)) {
                newSelectedIds.delete(id);
              } else {
                newSelectedIds.add(id);
              }
              setSelectedOrderIds(newSelectedIds);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderManagementTemplate; 
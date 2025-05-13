import React from 'react';
import { Order } from '../../../types/order';
import OrderTableRow from '../molecules/orderTableRow';
import Pagination from '../molecules/pagination';
import { useOrderStore } from '../../../stores/orderStore';

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onSizeChange: (size: number) => void;
  sortOption: number;
  onSortChange: (option: number) => void;
  totalCount: number;
  onOrderClick?: (order: Order) => void;
  isLoading: boolean;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onSizeChange,
  sortOption,
  onSortChange,
  totalCount,
  onOrderClick,
  isLoading,
}) => {
  const { selectedOrderIds, toggleOrderSelection } = useOrderStore();

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={10}>10개씩 보기</option>
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => onSortChange(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={0}>최신순</option>
            <option value={1}>발주번호순</option>
            <option value={2}>거래처순</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          총 {totalCount}개의 발주서
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">선택</th>
              <th className="p-4 text-left">발주등록번호</th>
              <th className="p-4 text-left">일자</th>
              <th className="p-4 text-left">발주담당자</th>
              <th className="p-4 text-left">거래처명</th>
              <th className="p-4 text-left">납기일자</th>
              <th className="p-4 text-left">품목</th>
              <th className="p-4 text-right">수량</th>
              <th className="p-4 text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onSelect={toggleOrderSelection}
                  onOrderClick={onOrderClick}
                  isSelected={selectedOrderIds.has(order.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center">
                  발주서가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default OrderTable; 
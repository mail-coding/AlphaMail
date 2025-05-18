import React from 'react';
import { Order } from '../../../types/order';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';
import { Spinner } from '@/shared/components/atoms/spinner';
import OrderTableRow from '../molecules/orderTableRow';

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
  onOrderClick: (order: Order) => void;
  isLoading: boolean;
  selectedOrderIds: Set<number>;
  onSelectOrder: (id: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  onOrderClick,
  isLoading,
  selectedOrderIds,
  onSelectOrder,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">
              <input
                type="checkbox"
                checked={orders.length > 0 && orders.every((order) => selectedOrderIds.has(order.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    orders.forEach((order) => onSelectOrder(order.id));
                  } else {
                    orders.forEach((order) => onSelectOrder(order.id));
                  }
                }}
                className="rounded border-gray-300"
              />
            </th>
            <th className="p-2">
              <Typography variant="body" bold>발주번호</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>거래처명</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>발주일자</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>납기일자</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>총 금액</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>상태</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 ? (
            orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                onSelect={onSelectOrder}
                onOrderClick={onOrderClick}
                isSelected={selectedOrderIds.has(order.id)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center">
                <Typography variant="body" color="text-gray-500">
                  발주서가 없습니다.
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="small"
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? 'font-bold underline' : ''}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </Button>
        <Typography variant="body" className="ml-4">
          총 {totalCount}개
        </Typography>
      </div>
    </div>
  );
};

export default OrderTable; 
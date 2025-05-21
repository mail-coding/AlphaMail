import React from 'react';
import { Order } from '../../../types/order';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';
import { Spinner } from '@/shared/components/atoms/spinner';
import OrderTableRow from '../molecules/orderTableRow';

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onSizeChange: (size: number) => void;
  sortOption: number;
  onSortChange: (option: number) => void;
  totalCount: number;
  onOrderClick: (order: Order) => void;
  isLoading: boolean;
  selectedOrderIds: Set<number>;
  onSelectOrder: (ids: Set<number>) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  currentPage,
  onPageChange,
  pageSize,
  totalCount,
  onOrderClick,
  isLoading,
  selectedOrderIds,
  onSelectOrder,
}) => {
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);

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
            <th className="p-2 border-r border-gray-200">
              <input
                type="checkbox"
                checked={orders.length > 0 && orders.every((order) => selectedOrderIds.has(order.id))}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  const newSelectedIds = new Set(selectedOrderIds);
                  
                  orders.forEach(order => {
                    if (isChecked) {
                      newSelectedIds.add(order.id);
                    } else {
                      newSelectedIds.delete(order.id);
                    }
                  });
                  
                  onSelectOrder(newSelectedIds);
                }}
                className="rounded border-gray-300"
              />
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body" >발주번호</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body" >거래처명</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body" >납기일자</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body" >품목</Typography>
            </th>
            <th className="p-2 border-r border-gray-200">
              <Typography variant="body" >담당자</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" >총 금액</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 ? (
            orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                onSelect={(id) => {
                  const newSelectedIds = new Set(selectedOrderIds);
                  if (newSelectedIds.has(id)) {
                    newSelectedIds.delete(id);
                  } else {
                    newSelectedIds.add(id);
                  }
                  onSelectOrder(newSelectedIds);
                }}
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
      <div className="flex justify-center items-center mt-4 gap-1">
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="min-w-[32px]"
        >
          &lt;
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant="ghost"
            size="small"
            onClick={() => onPageChange(pageNum)}
            className={`${currentPage === pageNum ? 'font-bold underline' : ''} min-w-[32px]`}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="min-w-[32px]"
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
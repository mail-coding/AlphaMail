import React from 'react';
import { Order } from '../../../types/order';
import { format } from 'date-fns';

interface OrderTableRowProps {
  order: Order;
  onSelect: (id: number, checked: boolean) => void;
  onOrderClick?: (order: Order) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onSelect,
  onOrderClick,
}) => {
  return (
    <tr className={`border-b hover:bg-gray-50 ${order.isSelected ? 'bg-blue-50' : ''}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={order.isSelected || false}
          onChange={(e) => onSelect(order.id, e.target.checked)}
          className="rounded border-gray-300"
        />
      </td>
      <td className="p-4">
        {onOrderClick ? (
          <button
            onClick={() => onOrderClick(order)}
            className="text-left hover:text-blue-600 hover:underline"
          >
            {order.orderNo}
          </button>
        ) : (
          <span>{order.orderNo}</span>
        )}
      </td>
      <td className="p-4">{format(new Date(order.createdAt), 'yyyy/MM/dd')}</td>
      <td className="p-4">{order.userName}</td>
      <td className="p-4">{order.clientName}</td>
      <td className="p-4">{format(new Date(order.deliverAt), 'yyyy/MM/dd')}</td>
      <td className="p-4">{order.productName}</td>
      <td className="p-4 text-right">{order.productCount.toLocaleString()}개</td>
      <td className="p-4 text-right">{order.price.toLocaleString()}원</td>
    </tr>
  );
};

export default OrderTableRow; 
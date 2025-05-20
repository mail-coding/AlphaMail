import React from 'react';
import { Order } from '../../../types/order';
import { Typography } from '@/shared/components/atoms/Typography';
import { format } from 'date-fns';

interface OrderTableRowProps {
  order: Order;
  onSelect: (id: number) => void;
  onOrderClick?: (order: Order) => void;
  isSelected: boolean;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onSelect,
  onOrderClick,
  isSelected,
}) => {
  return (
    <tr 
      className="border-t hover:bg-gray-50 cursor-pointer"
      onClick={() => onOrderClick?.(order)}
    >
      <td className="p-2 text-center border-r border-gray-200" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(order.id)}
          className="rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {order.orderNo}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {order.clientName}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {format(new Date(order.deliverAt), 'yyyy/MM/dd')}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {order.productCount > 1 ? `${order.productName} 외 ${order.productCount - 1}건` : order.productName}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {order.userName}
        </Typography>
      </td>
      <td className="p-2 text-center">
        <Typography variant="body">
          {order.price ? `${order.price.toLocaleString()}원` : '0원'}
        </Typography>
      </td>
      <td className="p-2 text-center">
        <Typography variant="body">
          {order.status}
        </Typography>
      </td>
    </tr>
  );
};

export default OrderTableRow; 
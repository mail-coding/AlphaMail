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
    <tr className="border-t hover:bg-gray-50">
      <td className="p-2 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(order.id)}
          className="rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="p-2">
        <a
          href={`/work/orders/${order.id}`}
          onClick={(e) => { e.preventDefault(); onOrderClick?.(order); }}
          className="text-left hover:text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 m-0 font-normal text-[12px] leading-normal"
        >
          {order.orderNo}
        </a>
      </td>
      <td className="p-2">
        <Typography variant="body">
          {order.clientName}
        </Typography>
      </td>
      <td className="p-2">
        <Typography variant="body">
          {format(new Date(order.createdAt), 'yyyy/MM/dd')}
        </Typography>
      </td>
      <td className="p-2">
        <Typography variant="body">
          {format(new Date(order.deliverAt), 'yyyy/MM/dd')}
        </Typography>
      </td>
      <td className="p-2 text-right">
        <Typography variant="body">
          {order.price ? `${order.price.toLocaleString()}원` : '0원'}
        </Typography>
      </td>
      <td className="p-2">
        <Typography variant="body">
          {order.status}
        </Typography>
      </td>
    </tr>
  );
};

export default OrderTableRow; 
import React from 'react';
import { Quote } from '../../../types/quote';
import { Typography } from '@/shared/components/atoms/Typography';
import { format } from 'date-fns';

interface QuoteTableRowProps {
  quote: Quote;
  onSelect: (id: number) => void;
  onQuoteClick?: (quote: Quote) => void;
}

export const QuoteTableRow: React.FC<QuoteTableRowProps> = ({
  quote,
  onSelect,
  onQuoteClick,
}) => {
  return (
    <tr 
      className="border-t hover:bg-gray-50 cursor-pointer"
      onClick={() => onQuoteClick?.(quote)}
    >
      <td className="p-2 text-center border-r border-gray-200" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={quote.isSelected}
          onChange={() => onSelect(quote.id)}
          className="rounded border-gray-300"
          onClick={e => e.stopPropagation()}
        />
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <a
          href={`/work/quotes/${quote.id}`}
          onClick={e => { e.preventDefault(); onQuoteClick?.(quote); }}
          className="text-center hover:text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 m-0 font-normal text-[12px] leading-normal"
        >
          {quote.quoteNo}
        </a>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {quote.clientName}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {format(new Date(quote.createdAt), 'yyyy/MM/dd')}
        </Typography>
      </td>
      <td className="p-2 text-center border-r border-gray-200">
        <Typography variant="body">
          {quote.userName}
        </Typography>
      </td>
      <td className="p-2 text-center">
        <Typography variant="body">
          {quote.price ? `${quote.price.toLocaleString()}원` : '0원'}
        </Typography>
      </td>
    </tr>
  );
}; 
import React from 'react';
import { Quote } from '../../../types/quote';
import { QuoteTableRow } from '../molecules/quoteTableRow';
import { useQuoteStore } from '../../../stores/quoteStore';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';

interface QuoteTableProps {
  companyId?: number;
  quotes: Quote[];
  onQuoteClick?: (quote: Quote) => void;
  onSelectQuote?: (id: number) => void;
  selectedQuoteIds?: Set<number>;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  onQuoteClick,
  onSelectQuote,
  selectedQuoteIds = new Set(),
}) => {
  const {
    currentPage,
    pageSize,
    setCurrentPage,
  } = useQuoteStore();

  const totalCount = quotes.length;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-center border-r border-gray-200">
              <input
                type="checkbox"
                checked={quotes.length > 0 && quotes.every((quote) => selectedQuoteIds.has(quote.id))}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  const currentPageQuoteIds = quotes.map(quote => quote.id);
                  currentPageQuoteIds.forEach(quoteId => {
                    if (selectedQuoteIds.has(quoteId) !== isChecked) {
                      onSelectQuote?.(quoteId);
                    }
                  });
                }}
                className="rounded border-gray-300"
              />
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>견적번호</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>거래처명</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>견적일자</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>담당자</Typography>
            </th>
            <th className="p-2 text-center">
              <Typography variant="body" bold>총 금액</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {quotes.length > 0 ? (
            quotes.map((quote) => (
              <QuoteTableRow
                key={quote.id}
                quote={{
                  ...quote,
                  isSelected: selectedQuoteIds.has(quote.id),
                }}
                onSelect={(id) => onSelectQuote?.(id)}
                onQuoteClick={onQuoteClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center">
                <Typography variant="body" color="text-gray-500">
                  견적서가 없습니다.
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
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </Button>
        {[...Array(pageCount)].map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="small"
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'font-bold underline' : ''}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === pageCount}
          onClick={() => handlePageChange(currentPage + 1)}
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
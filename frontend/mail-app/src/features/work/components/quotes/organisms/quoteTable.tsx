import React from 'react';
import { Quote } from '../../../types/quote';
import { QuoteTableRow } from '../molecules/quoteTableRow';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';
import { Spinner } from '@/shared/components/atoms/spinner';

interface QuoteTableProps {
  quotes: Quote[];
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onSizeChange: (size: number) => void;
  sortOption: number;
  onSortChange: (option: number) => void;
  totalCount: number;
  onQuoteClick?: (quote: Quote) => void;
  onSelectQuote?: (id: number) => void;
  selectedQuoteIds?: Set<number>;
  isLoading: boolean;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  currentPage,
  pageCount,
  onPageChange,
  totalCount,
  onQuoteClick,
  onSelectQuote,
  selectedQuoteIds = new Set(),
  isLoading,
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
              <Typography variant="body" bold>순번</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>등록번호</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>일자</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>담당자</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>거래처명</Typography>
            </th>
            <th className="p-2 text-center border-r border-gray-200">
              <Typography variant="body" bold>품목</Typography>
            </th>
            <th className="p-2 text-center">
              <Typography variant="body" bold>금액</Typography>
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
              <td colSpan={8} className="p-4 text-center">
                <Typography variant="body" color="text-gray-500">
                  견적서가 없습니다.
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
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
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
          disabled={currentPage >= pageCount}
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
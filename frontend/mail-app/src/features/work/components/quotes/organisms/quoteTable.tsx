import React from 'react';
import { Quote } from '../../../types/quote';
import { QuoteTableRow } from '../molecules/quoteTableRow';
import { Pagination } from '../../products/molecules/pagination';
import { useQuoteStore } from '../../../stores/quoteStore';

interface QuoteTableProps {
  companyId: number;
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
    sortOption,
    setCurrentPage,
    setPageSize,
    setSortOption,
  } = useQuoteStore();

  const totalCount = quotes.length;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: number) => {
    setSortOption(sort);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={10}>10개씩 보기</option>
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => handleSortChange(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={0}>최신순</option>
            <option value={1}>견적번호순</option>
            <option value={2}>금액순</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          총 {totalCount}개의 견적서
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">선택</th>
              <th className="p-4 text-left">순번</th>
              <th className="p-4 text-left">견적번호</th>
              <th className="p-4 text-left">일자</th>
              <th className="p-4 text-left">발주담당자</th>
              <th className="p-4 text-left">거래처명</th>
              <th className="p-4 text-left">품목</th>
              <th className="p-4 text-right">금액</th>
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
                  onSelect={onSelectQuote}
                  onQuoteClick={onQuoteClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  견적서가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}; 
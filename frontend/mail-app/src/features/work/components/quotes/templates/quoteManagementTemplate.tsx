import React, { useState } from 'react';
import { Quote, QuoteDetail } from '../../../types/quote';
import { QuoteSearchBar, QuoteSearchParams } from '../molecules/quoteSearchBar';
import { QuoteTable } from '../organisms/quoteTable';
import { useQuotes } from '../../../hooks/useQuote';
import { quoteService } from '../../../services/quoteService';

interface QuoteManagementTemplateProps {
  onAddQuote?: () => void;
  onQuoteClick?: (quote: QuoteDetail) => void;
  companyId?: number;
}

export const QuoteManagementTemplate: React.FC<QuoteManagementTemplateProps> = ({
  onAddQuote,
  onQuoteClick,
  companyId = 1,
}) => {
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<Set<number>>(new Set());
  const [keyword, setKeyword] = useState<string>('');

  const { data: quoteResponse, isLoading, error } = useQuotes({
    search: keyword,
    page: 1,
    size: 10,
  });

  const handleSearch = (params: QuoteSearchParams) => {
    setKeyword(params.keyword);
  };

  const handleQuoteClick = async (quote: Quote) => {
    try {
      const quoteDetail = await quoteService.getQuoteById(quote.id);
      onQuoteClick?.(quoteDetail);
    } catch (error) {
      console.error('견적서 상세 조회 실패:', error);
      alert('견적서 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const toggleQuoteSelection = (quoteId: number) => {
    setSelectedQuoteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(quoteId)) {
        newSet.delete(quoteId);
      } else {
        newSet.add(quoteId);
      }
      return newSet;
    });
  };

  const handleDelete = async () => {
    if (selectedQuoteIds.size === 0) {
      alert('삭제할 견적서를 선택해주세요.');
      return;
    }

    if (!window.confirm('선택한 견적서를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await quoteService.deleteQuotes(Array.from(selectedQuoteIds));
      setSelectedQuoteIds(new Set());
      alert('선택한 견적서가 삭제되었습니다.');
    } catch (error) {
      console.error('견적서 삭제 실패:', error);
      alert('견적서 삭제에 실패했습니다.');
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <QuoteSearchBar onSearch={handleSearch} />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onAddQuote}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              견적서 등록
            </button>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                출력
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
              >
                삭제
              </button>
            </div>
          </div>
          <QuoteTable
            companyId={companyId}
            quotes={quoteResponse?.contents || []}
            onQuoteClick={handleQuoteClick}
            onSelectQuote={toggleQuoteSelection}
            selectedQuoteIds={selectedQuoteIds}
          />
        </div>
      </div>
    </div>
  );
}; 
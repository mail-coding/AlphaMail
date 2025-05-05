import React from 'react';
import { Quote, QuoteDetail } from '../../../types/quote';
import { QuoteSearchBar, QuoteSearchParams } from '../molecules/quoteSearchBar';
import { QuoteTable } from '../organisms/quoteTable';
import { useQuoteStore } from '../../../stores/quoteStore';

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
  const {
    setKeyword,
    selectedQuoteIds,
    toggleQuoteSelection,
    setSelectedQuoteIds,
    fetchQuoteById,
    selectedQuote,
  } = useQuoteStore();

  const handleSearch = (params: QuoteSearchParams) => {
    setKeyword(params.keyword);
    // 여기에 검색 파라미터를 사용한 API 호출 로직 추가
    console.log('Search params:', params);
  };

  const handleQuoteClick = async (quote: Quote) => {
    try {
      await fetchQuoteById(quote.id);
      if (selectedQuote) {
        onQuoteClick?.(selectedQuote);
      }
    } catch (error) {
      console.error('Failed to fetch quote details:', error);
    }
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
      // API 호출 필요
      setSelectedQuoteIds(new Set());
      alert('선택한 견적서가 삭제되었습니다.');
    } catch (error) {
      console.error('견적서 삭제 실패:', error);
      alert('견적서 삭제에 실패했습니다.');
    }
  };

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
            onQuoteClick={handleQuoteClick}
            onSelectQuote={toggleQuoteSelection}
            selectedQuoteIds={selectedQuoteIds}
          />
        </div>
      </div>
    </div>
  );
}; 
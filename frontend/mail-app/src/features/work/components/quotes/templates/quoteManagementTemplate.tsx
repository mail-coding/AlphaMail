import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote } from '../../../types/quote';
import { QuoteSearchBar, QuoteSearchParams } from '../molecules/quoteSearchBar';
import { QuoteTable } from '../organisms/quoteTable';
import { useQuotes } from '../../../hooks/useQuote';
import { quoteService } from '../../../services/quoteService';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';

export const QuoteManagementTemplate: React.FC = () => {
  const navigate = useNavigate();
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

  const handleAddQuote = () => {
    navigate('/work/quotes/new');
  };

  const handleQuoteClick = (quote: Quote) => {
    navigate(`/work/quotes/${quote.id}`);
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
            <Button
              onClick={handleAddQuote}
              variant="text"
              size="large"
              className="flex items-baseline gap-2 p-0 bg-transparent shadow-none border-none text-black font-bold text-xl hover:bg-transparent hover:text-black active:bg-transparent"
            >
              <span className="text-2xl font-bold leading-none relative -top-[-1px]">+</span>
              <Typography variant="titleSmall" className="leading-none">견적서 등록하기</Typography>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                variant="text"
                size="small"
                className="min-w-[110px] h-[40px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
              >
                <Typography variant="titleSmall">삭제</Typography>
              </Button>
            </div>
          </div>
          <QuoteTable
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
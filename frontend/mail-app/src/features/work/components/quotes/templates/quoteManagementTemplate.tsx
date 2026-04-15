import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote } from '../../../types/quote';
import { QuoteSearchBar } from '../molecules/quoteSearchBar';
import { QuoteTable } from '../organisms/quoteTable';
import { useQuotes } from '../../../hooks/useQuote';
import { quoteService } from '../../../services/quoteService';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';
import { useQuoteStore } from '@/features/work/stores/quoteStore';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/shared/components/atoms/toast';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { WarningModal } from '@/shared/components/warningModal';

export const QuoteManagementTemplate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { 
    currentPage, 
    pageSize, 
    sortOption,
    searchParams,
    selectedQuoteIds,
    setCurrentPage,
    setPageSize,
    setSortOption,
    setSearchParams,
    setSelectedQuoteIds,
    clearSelection 
  } = useQuoteStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: quoteResponse, isLoading, error } = useQuotes({
    ...searchParams,
    page: currentPage,
    size: pageSize
  });

  // 페이지 변경 시 선택 초기화
  useEffect(() => {
    clearSelection();
  }, [currentPage, clearSelection]);

  // 서버의 현재 페이지와 클라이언트의 현재 페이지가 다를 경우 동기화
  useEffect(() => {
    if (quoteResponse?.currentPage && quoteResponse.currentPage !== currentPage) {
      setCurrentPage(quoteResponse.currentPage);
    }
  }, [quoteResponse?.currentPage, currentPage, setCurrentPage]);

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleAddQuote = () => {
    navigate('/work/quotes/new');
  };

  const handleQuoteClick = (quote: Quote) => {
    navigate(`/work/quotes/${quote.id}`);
  };

  const handleDelete = async () => {
    if (selectedQuoteIds.size === 0) {
      showToast('삭제할 견적서를 선택해주세요.', 'error');
      return;
    }

    // 모달 열기
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 처리 함수
  const confirmDelete = async () => {
    try {
      await quoteService.deleteQuotes(Array.from(selectedQuoteIds));
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
      await queryClient.invalidateQueries({ queryKey: ['quoteDetail'] });
      clearSelection();
      setSelectedQuoteIds(new Set());
      showToast('선택한 견적서가 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('견적서 삭제 실패:', error);
      showToast('견적서 삭제를 실패했습니다.', 'error');
    } finally {
      // 모달 닫기
      setIsDeleteModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  const handleSortChange = (option: number) => {
    setSortOption(option);
    setCurrentPage(1); // 정렬 옵션 변경 시 첫 페이지로 이동
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <QuoteSearchBar onSearch={handleSearch} />
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleAddQuote}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg "
              type="button"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E0EBFB]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#4885F9" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </span>
              <Typography variant="titleSmall">견적서 등록</Typography>
            </button>

              <div className="flex gap-2">
                <Button
                  onClick={handleDelete}
                  variant="text"
                  size="small"
                  className="min-w-[80px] h-[30px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
                >
                  <Typography variant="titleSmall">삭제</Typography>
                </Button>
              </div>
            </div>
            <QuoteTable
              quotes={quoteResponse?.contents || []}
              currentPage={currentPage}
              pageCount={quoteResponse?.pageCount || 0}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onSizeChange={handleSizeChange}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              totalCount={quoteResponse?.totalCount || 0}
              onQuoteClick={handleQuoteClick}
              isLoading={isLoading}
              selectedQuoteIds={selectedQuoteIds}
              onSelectQuote={(id) => {
                const newSelectedIds = new Set(selectedQuoteIds);
                if (newSelectedIds.has(id)) {
                  newSelectedIds.delete(id);
                } else {
                  newSelectedIds.add(id);
                }
                setSelectedQuoteIds(newSelectedIds);
              }}
            />
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 추가 */}
      <WarningModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-500" />}
        title={<Typography variant="titleMedium">견적서 삭제</Typography>}
        description={
          <Typography variant="body">
            선택한 {selectedQuoteIds.size}개의 견적서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Typography>
        }
        actions={
          <>
            <Button
              variant="text"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              삭제
            </Button>
          </>
        }
      />
    </>
  );
}; 
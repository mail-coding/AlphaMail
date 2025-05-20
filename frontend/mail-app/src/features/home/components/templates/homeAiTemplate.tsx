import React, { useEffect, useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { AiAssistantRow } from '../organisms/aiAssistantRow';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useHome } from '../../hooks/useHome';
import { AssistantType, assistantTypeMap } from '../../types/home';
import { format } from 'date-fns';
import { Spinner } from '@/shared/components/atoms/spinner';
import { useUser } from '@/features/auth/hooks/useUser';
import { ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export const HomeAiTemplate: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작하는 페이지 인덱스 사용
  const { useAssistants } = useHome();
  const { data:user } = useUser(); // 현재 로그인한 사용자 정보 가져오기

  // API에서 데이터 가져오기
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useAssistants({
    page: currentPage,
    size: ITEMS_PER_PAGE
  }); 

  const totalPages = data?.pageCount || 0;
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('AI 데이터 갱신');
      refetch();
    }, 10000); // 10초마다 갱신
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  // 페이지 포커스 시 데이터 갱신
  useEffect(() => {
    // 페이지가 포커스될 때 데이터 다시 가져오기
    const handleFocus = () => {
      console.log('홈 페이지 포커스 감지 - AI 데이터 갱신');
      refetch();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // 페이지 가시성 변경 감지 (탭 전환 등)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
        
    // 컴포넌트 마운트 시 데이터 갱신
    refetch();
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch, user?.id]); // 사용자 ID가 변경될 때도 다시 실행

  useEffect(() => {
    console.log('사용자 변경 감지 - AI 데이터 갱신');
    // 사용자 변경 시 첫 페이지로 리셋
    setCurrentPage(0);
    refetch();
  }, [user?.id, refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터 시작하는 페이지 번호 사용
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // 날짜 포맷 변환 함수
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full min-h-[700px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <Typography variant="titleMedium">AI 업무 비서</Typography>
        <button 
          onClick={() => refetch()} 
          className="text-gray-500 hover:text-blue-500"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-grow">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="large" />
          </div>
        )}
        
        {/* 에러 상태 */}
        {isError && (
          <div className="text-center py-10 text-red-500">
            <Typography variant="body">데이터를 불러오는 중 오류가 발생했습니다.</Typography>
          </div>
        )}
        
        {/* 아이템 목록 */}
        {!isLoading && !isError && (
          <div className="space-y-1 flex-grow">
            {data?.contents && data.contents.length > 0 ? (
              data.contents.map((item, index) => (
                <AiAssistantRow
                  key={`${item.id}-${index}`}
                  id={item.id.toString()}
                  type={item.type as AssistantType}
                  title={item.title || `${assistantTypeMap[item.type]} 항목`}
                  date={formatDate(item.emailTime)}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Typography variant="body">표시할 항목이 없습니다.</Typography>
              </div>
            )}
          </div>
        )}
        
        {/* 페이지네이션 */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className={`p-1 rounded-md ${
                currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <div className="flex mx-2 space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page - 1
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-1 rounded-md ${
                currentPage === totalPages - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
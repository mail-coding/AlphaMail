import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { useUnreadMails } from '@/features/home/hooks/useUnreadMails';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLocation, useNavigate } from 'react-router-dom';
import { queryClient } from '@/shared/lib/queryClient';
import { ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from "framer-motion";

export const HomeUnreadMailBox: React.FC = () => {
  const { data: unreadMailsData, isLoading, error, refetch } = useUnreadMails(10);
  const location = useLocation();

  // readStatus가 false인 메일만 필터링
  const unreadMails = useMemo(() => 
    unreadMailsData?.data 
      ? unreadMailsData.data.filter(mail => mail.readStatus === false) 
      : []
  , [unreadMailsData?.data]);
  
  // 이전 메일 데이터를 저장하기 위한 ref
  const prevMailsRef = useRef<typeof unreadMails>([]);
  // 새로운 메일 ID를 저장하는 상태
  const [newMailIds, setNewMailIds] = useState<string[]>([]);
  
  const slideInVariants = {
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 40, opacity: 0 },
  };
  
  // 필터링된 메일 수를 totalCount로 사용
  const totalCount = unreadMails.length;
  
  const navigate = useNavigate();
  
  // 메일 상세 페이지로 이동
  const handleMailClick = (mailId: string) => {
    navigate(`/mail/${mailId}`);
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yy-MM-dd HH:mm', { locale: ko });
  };

  useEffect(() => {
    if (unreadMails.length > 0) {
      // 이전 데이터에 없던 새 메일 ID 찾기
      const prevIds = new Set(prevMailsRef.current.map(mail => mail.id.toString()));
      const newIds = unreadMails
        .filter(mail => !prevIds.has(mail.id.toString()))
        .map(mail => mail.id.toString());
      
      if (newIds.length > 0) {
        setNewMailIds(newIds);
        // 3초 후 애니메이션 상태 초기화
        setTimeout(() => {
          setNewMailIds([]);
        }, 3000);
      }
    }
    
    // 현재 메일 데이터를 이전 데이터로 저장
    prevMailsRef.current = unreadMails;
  }, [unreadMails]);

  useEffect(() => {
    // 현재 경로가 홈 페이지이고, 이전에 메일 페이지를 방문했다면 데이터 갱신
    if (location.pathname === '/' || location.pathname === '/home') {
      console.log('홈 페이지로 돌아옴 - 안읽은 메일 데이터 갱신');
      refetch();
    }
  }, [location.pathname, refetch]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('안읽은 메일 데이터 갱신');
      refetch();
    }, 10000); // 10초마다 갱신
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  // 메일 읽음 상태 변경 감지
  useEffect(() => {
    // 메일 읽음 상태 변경 이벤트 구독
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      // 메일 상세 쿼리가 변경되면 안읽은 메일 목록 갱신
      const mailQueries = queryClient.getQueriesData({ queryKey: ['mail', 'detail'] });
      if (mailQueries.length > 0) {
        refetch();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const refreshData = () => {
    // 토스트 알림 표시
    toast.info('안읽은 메일 목록을 새로고침합니다.', {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // 쿼리 무효화 및 새로고침
    queryClient.invalidateQueries({ 
      queryKey: ['mails', 'unread'],
      refetchType: 'all'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="titleMedium">안읽은 메일 {totalCount}건</Typography>
        <button 
          onClick={refreshData}
          className="text-gray-500 hover:text-blue-500"
          title="새로고침"
        >
          <RefreshIcon className="h-5 w-5" />
      </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <Typography variant="body">로딩 중...</Typography>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <Typography variant="body">메일을 불러오는데 실패했습니다.</Typography>
        </div>
      ) : unreadMails.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Typography variant="body">안읽은 메일이 없습니다.</Typography>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] border border-gray-200 p-3 rounded-md overflow-y-auto">
          <AnimatePresence initial={false}>
            {unreadMails.map((mail) => {
              const isNewMail = newMailIds.includes(mail.id.toString());
              return (
                <motion.div
                  key={mail.id}
                  variants={slideInVariants}
                  initial={isNewMail ? "initial" : false}
                  animate="animate"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    mass: 1,
                  }}
                  layout
                  className="border-b border-gray-100 pb-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleMailClick(mail.id.toString())}
                >
                  <Typography variant="body" className="font-medium">
                    {mail.sender || '발신자 없음'}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600 truncate block">
                    {mail.subject || '(제목 없음)'}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    {formatDate(mail.receivedDateTime)}
                  </Typography>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      )}
    </div>
  );
};
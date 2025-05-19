import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@/shared/components/atoms/Typography';
import { useHeaderStore } from '@/shared/stores/useHeaderStore';
import { SearchBar } from '@/shared/components/searchBar';
import { useUser } from '@/features/auth/hooks/useUser';

export const HeaderContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { title, subtitle, mailStats } = useHeaderStore();
  const {data: userData} = useUser();
  const userName = userData?.name;
  
  const isSearchablePath = path === '/mail' || path === '/mail/sent' || path === '/schedule';

  // 경로에 따라 다른 헤더 내용 반환
  if (path === '/') {
    return (
      <Typography variant="titleSmall" className="text-[#606060]">
        {userName}님 오늘 업무도 파이팅하세요
      </Typography>
    );
  } else if (path.startsWith('/mail')) {
    // 메일 경로에 따라 다른 헤더 타이틀과 통계 표시
    let mailTitle = "메일";
    let showMailStats = false;
    
    if (path === '/mail') {
      mailTitle = "받은 메일함";
      showMailStats = true;
    } else if (path === '/mail/sent') {
      mailTitle = "보낸 메일함";
    } else if (path === '/mail/trash') {
      mailTitle = "휴지통";
    } else {
      mailTitle = title 
      showMailStats = path === '/mail';
    }
        
    return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Typography variant="titleLarge">
              {mailTitle}
            </Typography>
            
            {/* 받은 메일함에서만 메일 통계 표시 */}
            {showMailStats && mailStats.totalCount >= 0 && (
              <Typography variant="body" className="text-gray-600 ml-4">
                전체메일 {mailStats.totalCount} / 안읽은메일 {mailStats.unreadCount}
              </Typography>
            )}
            
            {subtitle && (
              <Typography variant="body" className="text-gray-600 ml-4">
                {subtitle}
              </Typography>
            )}
            
          </div>
          {/* 검색창 (받은 메일함과 보낸 메일함에서만 표시) */}
          {isSearchablePath && <SearchBar />}
      </div>
    );
  } else if (path === '/schedule') {
    return (
      <div className="flex items-center justify-between w-full">
        <Typography variant="titleLarge">
          일정
        </Typography>
        {isSearchablePath && <SearchBar />}
      </div>
    );
  } else if (path.startsWith('/work')) {
    let workTitle = "견적서 관리";
    
    if (path.startsWith('/work/quotes')) {
      workTitle = "견적서 관리";
    } else if (path.startsWith('/work/orders')) {
      workTitle = "주문서 관리";
    } else if (path.startsWith('/work/clients')) {
      workTitle = "거래처 관리";
    } else if (path.startsWith('/work/products')) {
      workTitle = "재고 관리";
    }
    return (
      <Typography variant="titleLarge">
        {workTitle}
      </Typography>
    );
  }
  
  return null;
};
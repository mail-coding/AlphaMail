import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import { Router } from '@/routes/Router';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from '@/shared/Layout/navBar';
import { Header } from './shared/Layout/header';
import { Typography } from './shared/components/atoms/Typography';
import { useLocation } from 'react-router-dom';
import { SideBar } from './shared/Layout/sideBar';
import { useSidebarStore } from './shared/stores/useSidebarStore';

// 헤더 내용을 결정하는 컴포넌트
const HeaderContent = () => {
  const location = useLocation();
  const path = location.pathname;
  const { activeItem } = useSidebarStore();

  // 경로에 따라 다른 헤더 내용 반환
  if (path === '/') {
    return (
      <Typography variant="titleSmall" className="text-[#606060]">
        김싸피님 오늘 업무도 파이팅하세요
      </Typography>
    );
  } else if (path === '/mail') {
    return (
      <Typography variant="titleLarge">
        메일
      </Typography>
    );
  } else if (path === '/schedule') {
    return (
      <Typography variant="titleLarge">
        일정
      </Typography>
    );
  } else if (path === '/work') {
    return (
      <Typography variant="titleLarge">
        {activeItem || 'work'}
      </Typography>
    );
  }
};

// 라우터를 포함한 앱 레이아웃 컴포넌트
const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const { setActiveItem } = useSidebarStore();

  // 사이드바 표시 여부 및 타입 결정
  const showSidebar = path === '/mail' || path === '/work';
  const sidebarType = path === '/mail' ? 'mail' : 'work';

  useEffect(() => {
    setActiveItem(null);
  }, [path, setActiveItem]);

  return (
    <div className="flex h-screen">
      <NavBar />
      {showSidebar && <SideBar type={sidebarType} />}
      <main className="flex-1 overflow-auto flex flex-col">
        <Header>
          <HeaderContent />
        </Header>
        <div className="flex-1">
          <Router />
        </div>
      </main>
    </div>
  );
};


export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<div>로딩 중...</div>}>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

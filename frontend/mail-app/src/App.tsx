import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import { Router } from '@/routes/Router';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from '@/shared/Layout/navBar';
import { Header } from './shared/Layout/header';
import { useLocation } from 'react-router-dom';
import { SideBar } from './shared/Layout/sideBar';
import { useSidebarStore } from './shared/stores/useSidebarStore';
import { HeaderContent } from './shared/Layout/headerContent';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { useAuthGuard } from './shared/hooks/useAuthGuard';
import ChatBot from './shared/components/ChatBot';

// 라우터를 포함한 앱 레이아웃 컴포넌트
const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const { setActiveItem } = useSidebarStore();

  // 인증 상태 체크 추가
  useAuthGuard();

  // 사이드바 표시 여부 및 타입 결정
  const showSidebar = path.startsWith('/mail') || path.startsWith('/work');
  const sidebarType = path.startsWith('/mail') ? 'mail' : 'work';

  useEffect(() => {
    // 메일 페이지가 아닌 경우에만 activeItem을 null로 설정
    if (!path.startsWith('/mail')) {
      setActiveItem(null);
    }
  }, [path, setActiveItem]);

  // 로그인 페이지일 경우 SideBar만 숨김
  if (path === '/login') {
    return (
      <div className="flex h-screen">
        {/* <NavBar /> */}
        <main className="flex-1">
          <Router />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <NavBar />
      {showSidebar && <SideBar type={sidebarType} />}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header className="flex-shrink-0">
          <HeaderContent />
        </Header>
        <div className="flex-1 overflow-auto">
          <Router />
        </div>
      </main>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBot />
      </div>
    </div>
  );
};


export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<div>로딩 중...</div>}>
          <BrowserRouter>
            <AuthProvider>
              <AppLayout />
            </AuthProvider>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

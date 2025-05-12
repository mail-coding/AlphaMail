import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/atoms/Typography';
import { useNavbarStore } from '../stores/useNavbarStore';
import { useEffect } from 'react';

export const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    const { isCollapsed, toggleCollapse, contentVisible, setContentVisible } = useNavbarStore();
    
    // 현재 경로가 /mail로 시작하는지 확인
    const isMailActive = path.startsWith('/mail');
    const isScheduleActive = path.startsWith('/schedule');
    const isWorkActive = path.startsWith('/work');
  
      // isCollapsed 상태가 변경될 때 콘텐츠 가시성 관리
    useEffect(() => {
        // 네비바가 확장될 때만 지연 후 콘텐츠 표시
        if (!isCollapsed) {
        const timer = setTimeout(() => {
            setContentVisible(true);
        }, 150);
        
        return () => clearTimeout(timer);
        }
    }, [isCollapsed, setContentVisible]);

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={cn(
            "h-screen bg-[#66BAE4] flex flex-col transition-all duration-300",
            isCollapsed ? "w-[70px]" : "w-[190px]"
          )}>
            {/* 햄버거 버튼 영역 */}
            <div className="p-4 flex justify-start">
                <button 
                onClick={toggleCollapse}
                className="p-1 hover:bg-[#3E99C6] rounded text-white"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                </button>
            </div>

            {/* 로고 영역 */}
            <div className="h-[120px] relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
                <div className="w-16 h-16 flex-shrink-0">
                    <img src="/logo.png" alt="ALPHAMAIL 로고" className="w-full h-full" />
                </div>
                </div>
                {!isCollapsed && contentVisible && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-[70px] text-white text-xl font-light whitespace-nowrap">
                    ALPHAMAIL
                </div>
                )}
            </div>

            <div className="py-2"></div>

            {/* 메뉴 영역 */}
            <nav className="flex-1 mt-4">
                <ul className="px-2 space-y-1">
                <li>
                    <Link to="/">
                    <div className={cn(
                        "flex items-center h-[40px] px-4 text-white rounded-md transition-colors",
                        path === '/' ? "bg-[#3E99C6]" : "hover:bg-[#3E99C6]"
                    )}>
                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <img src="/home.png" alt="홈" className="w-5 h-5" />
                        </div>
                        {!isCollapsed && contentVisible && (
                        <Typography variant="titleSmall" color="text-white" className="ml-3">홈</Typography>
                        )}
                    </div>
                    </Link>
                </li>
                <li>
                    <Link to="/mail">
                    <div className={cn(
                        "flex items-center h-[40px] px-4 text-white rounded-md transition-colors",
                        isMailActive ? "bg-[#3E99C6]" : "hover:bg-[#3E99C6]"
                    )}>
                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <img src="/mail_outline.png" alt="메일" className="w-5 h-5" />
                        </div>
                        {!isCollapsed && contentVisible && (
                        <Typography variant="titleSmall" color="text-white" className="ml-3">메일</Typography>
                        )}
                    </div>
                    </Link>
                </li>
                <li>
                    <Link to="/schedule">
                    <div className={cn(
                        "flex items-center h-[40px] px-4 text-white rounded-md transition-colors",
                        isScheduleActive ? "bg-[#3E99C6]" : "hover:bg-[#3E99C6]"
                    )}>
                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <img src="/date_range.png" alt="일정" className="w-5 h-5" />
                        </div>
                        {!isCollapsed && contentVisible && (
                        <Typography variant="titleSmall" color="text-white" className="ml-3">일정</Typography>
                        )}
                    </div>
                    </Link>
                </li>
                <li>
                    <Link to="/work">
                    <div className={cn(
                        "flex items-center h-[40px] px-4 text-white rounded-md transition-colors",
                        isWorkActive ? "bg-[#3E99C6]" : "hover:bg-[#3E99C6]"
                    )}>
                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <img src="/business_center.png" alt="work+" className="w-5 h-5" />
                        </div>
                        {!isCollapsed && contentVisible && (
                        <Typography variant="titleSmall" color="text-white" className="ml-3">work+</Typography>
                        )}
                    </div>
                    </Link>
                </li>
                </ul>
            </nav>

            {/* 로그인/로그아웃 버튼 영역 */}
            <div className="p-4 mt-auto space-y-2">
                {/* 로그인 버튼 */}
                {!isCollapsed && contentVisible ? (
                    <button 
                        onClick={handleLogin}
                        className="w-full py-3 text-white border border-white rounded-md hover:bg-[#3E99C6] transition-colors"
                    >
                        <Typography variant="titleSmall" color="text-white">로그인</Typography>
                    </button>
                ) : (
                    <button 
                        onClick={handleLogin}
                        className="w-full flex justify-center py-3 text-white border border-white rounded-md hover:bg-[#3E99C6] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10 17 15 12 10 7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                    </button>
                )}

                {/* 로그아웃 버튼 */}
                {!isCollapsed && contentVisible ? (
                    <button className="w-full py-3 text-white border border-white rounded-md hover:bg-[#3E99C6] transition-colors">
                        <Typography variant="titleSmall" color="text-white">로그아웃</Typography>
                    </button>
                ) : (
                    <button className="w-full flex justify-center py-3 text-white border border-white rounded-md hover:bg-[#3E99C6] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                )}
            </div>
            </div>
    );
};

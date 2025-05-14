import React from 'react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const { data: userInfo } = useUserInfo();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/user/confirm-password');
  };

  return (
    <header className="w-full h-[70px] min-h-[70px] border-b border-[#DBD5D5] flex items-center px-6">
      <div className="flex-1 flex items-center justify-between">{children}</div>
      <div 
        className="w-10 h-10 rounded-full bg-[#B1B1B1] ml-6 cursor-pointer hover:bg-[#9B9B9B] transition-colors flex items-center justify-center text-white font-medium"
        onClick={handleProfileClick}
      >
        {userInfo?.name?.charAt(0) || '?'}
      </div>
    </header>
  );
};
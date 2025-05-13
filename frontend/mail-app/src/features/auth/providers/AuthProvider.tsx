import React, { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { Spinner } from '@/shared/components/atoms/spinner';
import { useUserStore } from '@/shared/stores/useUserStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setAuth, logout } = useUserStore();
  const { data: user, isLoading, isError } = useUser();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken && user && !isError) {
      setAuth(accessToken);
    }

    if (isError) {
      logout();
    }
  }, [user, isError, setAuth, logout, accessToken]);

  if (isLoading && accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return <>{children}</>;
}; 
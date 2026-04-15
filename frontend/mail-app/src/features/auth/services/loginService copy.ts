import { api } from '../../../shared/lib/axiosInstance';
import { LoginResponse } from '../types/login';
import { queryClient } from '@/shared/lib/queryClient';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/login', { email, password });
  const { accessToken, refreshToken } = response.data;
  
  // 토큰들을 localStorage에 저장
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  return response.data;
};

export const loginService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/login', { email, password });

    queryClient.clear();

    return response.data;
  },

  logout: async (): Promise<void> => {
    const response = await api.post('/api/logout');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    queryClient.clear();

    return response.data;
  },
};
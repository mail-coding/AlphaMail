import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';
import { toast } from 'react-toastify';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: '/',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(config.headers.Authorization);
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 현재 경로가 로그인 페이지인 경우 에러 처리하지 않음
    if (window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    // 토큰 만료(401) 또는 권한 없음(403) 에러 처리
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 토큰 제거 및 로그아웃 처리
      localStorage.removeItem('accessToken');
      useUserStore.getState().logout();
      toast.error("로그인 시간이 만료되어 로그아웃 되었습니다.");
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

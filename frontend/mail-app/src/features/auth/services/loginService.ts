import { api } from '../../../shared/lib/axiosInstance';
import { LoginResponse } from '../types/login';
import { queryClient } from '@/shared/lib/queryClient';

// Mock 토큰 생성 함수
const generateMockTokens = (): LoginResponse => {
  return {
    accessToken: 'mock_access_token_admin_1111',
    refreshToken: 'mock_refresh_token_admin_1111',
    expiresIn: 3600,
  };
};

// Mock 사용자 데이터
const mockUsers = {
  'admin@alphamail.my': {
    id: 1,
    companyId: 1,
    companyName: 'Alpha Company',
    groupId: 1,
    groupName: 'IT Team',
    position: 'Admin',
    name: 'Admin User',
    email: 'admin@alphamail.my',
    phoneNum: '010-1234-5678',
    image: '',
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // 개발 모드: admin/1111로 하드코딩된 로그인
  const normalizedEmail = email.includes('@') ? email : `${email}@alphamail.my`;
  
  if (normalizedEmail === 'admin@alphamail.my' && password === '1111') {
    const tokens = generateMockTokens();
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    // Mock 사용자 정보도 저장 (선택사항)
    localStorage.setItem('mockUserData', JSON.stringify(mockUsers['admin@alphamail.my']));
    return tokens;
  }

  // 실제 API 호출 (필요시 주석 제거)
  try {
    const response = await api.post<LoginResponse>('/api/login', { email: normalizedEmail, password });
    const { accessToken, refreshToken } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('로그인 실패');
  }
};

export const loginService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // 개발 모드: admin/1111로 하드코딩된 로그인
    const normalizedEmail = email.includes('@') ? email : `${email}@alphamail.my`;
    
    if (normalizedEmail === 'admin@alphamail.my' && password === '1111') {
      const tokens = generateMockTokens();
      localStorage.setItem('mockUserData', JSON.stringify(mockUsers['admin@alphamail.my']));
      queryClient.clear();
      return tokens;
    }

    // 실제 API 호출
    try {
      const response = await api.post<LoginResponse>('/api/login', { 
        email: normalizedEmail, 
        password 
      });

      queryClient.clear();

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('로그인 실패');
    }
  },

  logout: async (): Promise<void> => {
    const response = await api.post('/api/logout');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mockUserData');

    queryClient.clear();

    return response.data;
  },
};
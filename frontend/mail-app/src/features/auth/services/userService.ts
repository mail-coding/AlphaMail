import { api } from '../../../shared/lib/axiosInstance';
import { User } from '../types/users';

// Mock 사용자 데이터
const mockUser: User = {
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
};

export const userService = {
  getUser: async (): Promise<User> => {
    // 개발 모드: Mock 데이터 반환
    const mockData = localStorage.getItem('mockUserData');
    if (mockData) {
      return JSON.parse(mockData);
    }

    // localStorage에 Mock 데이터가 없으면 기본값 반환
    if (localStorage.getItem('accessToken')?.includes('mock')) {
      return mockUser;
    }

    // 실제 API 호출
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.get<User>('/api/users/my');
      return response.data;
    } catch (error) {
      // 오류 시 Mock 데이터 반환 (테스트 용도)
      throw error;
    }
  },
};
import axios from 'axios';
import {
  createMockSchedules,
  createMockMailList,
  createMockAssistants,
  createMockFolders,
  createMockUser,
} from './mockDataFactory';

// Mock 데이터 정의
const mockData = {
  '/api/assistants': createMockAssistants(),
  '/api/mails/folders': createMockFolders(),
  '/api/mails': createMockMailList(),
  '/api/schedules': createMockSchedules(),
  '/api/users/my': createMockUser(),
};

// Mock 데이터 경로 매핑 (정규식)
const mockRoutes = [
  {
    pattern: /^\/api\/assistants/,
    key: '/api/assistants',
  },
  {
    pattern: /^\/api\/mails\/folders/,
    key: '/api/mails/folders',
  },
  {
    pattern: /^\/api\/mails/,
    key: '/api/mails',
  },
  {
    pattern: /^\/api\/schedules/,
    key: '/api/schedules',
  },
  {
    pattern: /^\/api\/users\/my/,
    key: '/api/users/my',
  },
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

// Request 인터셉터 - Bearer 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Bearer', token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 - Mock 데이터 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 모든 에러에 대해 Mock 데이터 시도 (네트워크 에러뿐만 아니라)
    const originalRequest = error.config;
    const url = originalRequest.url || '';

    console.log(`[INTERCEPTOR] 요청 URL: ${url}, 파라미터:`, originalRequest.params);

    // 일치하는 Mock 경로 찾기
    const matchedRoute = mockRoutes.find((route) =>
      route.pattern.test(url)
    );

    if (matchedRoute) {
      const mockDataKey = matchedRoute.key;
      let data = mockData[mockDataKey as keyof typeof mockData];

      // /api/mails 요청일 때 파라미터에 따라 필터링
      if (mockDataKey === '/api/mails' && originalRequest.params) {
        const params = originalRequest.params;
        // readStatus가 false인 경우 안 읽은 메일만 필터링
        if (params.readStatus === false || params.readStatus === 'false') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unreadEmails = (data as any).emails.filter((mail: any) => !mail.readStatus);
          data = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(data as any),
            emails: unreadEmails,
            totalCount: unreadEmails.length,
            readCount: 0,
          };
          console.log(`[MOCK] 안 읽은 메일만 필터링: ${unreadEmails.length}개`);
        }
      }

      if (data) {
        console.log(`[MOCK] ${originalRequest.method?.toUpperCase()} ${url} - Mock 데이터 반환`, data);

        // Mock 응답 객체 반환
        return Promise.resolve({
          data,
          status: 200,
          statusText: 'OK (Mock Data)',
          headers: {},
          config: originalRequest,
        });
      }
    }

    console.log(`[MOCK] 매칭되는 Mock 경로 없음: ${url}`);
    return Promise.reject(error);
  }
);

export { api };
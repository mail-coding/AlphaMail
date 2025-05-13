import { MailListResponse, MailDetailResponse, UpdateMailRequest, MoveMailsRequest, SendMailRequest, SendMailResponse, FolderResponse } from '../types/mail';
import { api } from '@/shared/lib/axiosInstance';

const logApiCall = (method: string, endpoint: string, requestData?: Record<string, unknown>) => {
  console.log(`🚀 API 요청: ${method} ${endpoint}`, requestData ? { 요청데이터: requestData } : '');
};

const logApiResponse = (method: string, endpoint: string, response: Record<string, unknown>, status: number) => {
  console.log(`✅ API 응답: ${method} ${endpoint}`, { 
    상태코드: status, 
    응답데이터: response 
  });
};

const logApiError = (method: string, endpoint: string, error: Record<string, unknown> & { 
  response?: { 
    status?: number, 
    data?: unknown 
  }, 
  message?: string 
}) => {
  console.error(`❌ API 오류: ${method} ${endpoint}`, { 
    상태코드: error.response?.status, 
    오류메시지: error.message,
    응답데이터: error.response?.data
  });
};

// 메일 서비스 클래스
export const mailService = {
  // 메일 목록 조회
  async getMailList(folderId?: number, page: number = 1, size: number = 15, sort: number = 0, keyword?: string): Promise<MailListResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page - 1)); // API는 0부터 시작하는 페이지 인덱스 사용
    params.append('size', String(size));
    params.append('sort', String(sort));
    
    // 검색어가 있으면 추가
    if (keyword && keyword.trim() !== '') {
      params.append('query', keyword);
    }
    
    if (folderId) {
        params.append('folderId', String(folderId));
    }
    
    const endpoint = `/api/mails`;
    logApiCall('GET', endpoint, { params: Object.fromEntries(params) });
    
    try {
      const response = await api.get(endpoint, { params });
      logApiResponse('GET', endpoint, response.data, response.status);
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
  // 메일 상세 조회
  async getMailDetail(id: string | number): Promise<MailDetailResponse> {
    const endpoint = `/api/mails/${id}`;
    const params = new URLSearchParams();
    
    logApiCall('GET', endpoint, { params: Object.fromEntries(params) });
    
    try {
      const response = await api.get(endpoint, { params });
      logApiResponse('GET', endpoint, response.data, response.status);
      console.log('API에서 받은 recipients:', response.data.recipients)
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  // 메일 읽음 상태 변경
  async updateMailReadStatus(id: number, readStatus: boolean): Promise<void> {
    const data: UpdateMailRequest = {
      id,
      readStatus,
    };
    
    const endpoint = `/api/mails/${id}/read-status`;
    logApiCall('PUT', endpoint, data as unknown as Record<string, unknown>);
    
    try {
      const response = await api.put(endpoint, data);
      logApiResponse('PUT', endpoint, response.data, response.status);
    } catch (error) {
      logApiError('PUT', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  // 메일 폴더 이동
  async moveMails(ids: number[], targetFolderId: number): Promise<void> {
    const data: MoveMailsRequest = {
      ids,
      targetFolderId,
    };
    
    const endpoint = `/api/mails/move`;
    logApiCall('POST', endpoint, data as unknown as Record<string, unknown>);
    
    try {
      const response = await api.post(endpoint, data);
      logApiResponse('POST', endpoint, response.data, response.status);
    } catch (error) {
      logApiError('POST', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
  // 메일 삭제 (휴지통으로 이동)
  async deleteMails(ids: number[]): Promise<void> {
    const data = {
      mailList: ids,
    };
    
    const endpoint = `/api/mails/trash`;
    logApiCall('PATCH', endpoint, data);
    
    try {
      const response = await api.patch(endpoint, data);
      logApiResponse('PATCH', endpoint, response.data, response.status);
    } catch (error) {
      logApiError('PATCH', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
  // 메일 상세에서 삭제 (휴지통으로 이동)
  async deleteMailById(mailId: number, folderId: number = 3): Promise<void> {
    const data = {
      folderId: folderId,
    };
    
    const endpoint = `/api/mails/${mailId}/trash`;
    logApiCall('PATCH', endpoint, data);
    
    try {
      const response = await api.patch(endpoint, data);
      logApiResponse('PATCH', endpoint, response.data, response.status);
    } catch (error) {
      logApiError('PATCH', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  // 메일 영구 삭제 (휴지통 비우기)
  async emptyTrash(folderId: number = 3): Promise<{ deletedCount: number }> {
    const data = {
      folderId: folderId,
    };
    
    const endpoint = `/api/mails/trash`;
    logApiCall('DELETE', endpoint, data);
    
    try {
      const response = await api.delete(endpoint, { 
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      logApiResponse('DELETE', endpoint, response.data, response.status);
      return response.data;
    } catch (error) {
      logApiError('DELETE', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  async sendMail(mailData: SendMailRequest, files?: File[]): Promise<SendMailResponse> {
    const params = new URLSearchParams();
    const endpoint = `/api/mails?${params.toString()}`;
    
    // FormData 객체 생성
    const formData = new FormData();
    
    // JSON 데이터를 Blob으로 변환하여 FormData에 추가 (명시적으로 application/json 타입 지정)
    const jsonBlob = new Blob([JSON.stringify(mailData)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    // 첨부파일이 있으면 FormData에 추가
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    console.log('첨부파일 정보:', files?.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      byte: file.bytes,
      lastModified: new Date(file.lastModified).toISOString()
    })));
  
    logApiCall('POST', endpoint, { 
      mailData, 
      filesCount: files?.length || 0 
    });
    
    try {
      // Content-Type 헤더를 설정하지 않고 Axios가 자동으로 boundary를 설정하도록 함
      const response = await api.post(endpoint, formData);
      logApiResponse('POST', endpoint, response.data, response.status);
      return response.data;
    } catch (error) {
      logApiError('POST', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  // 폴더 조회 기능 추가
  async getFolders(): Promise<FolderResponse[]> {
    const endpoint = `/api/mails/folders`;
    const params = new URLSearchParams();
    
    logApiCall('GET', endpoint, { params: Object.fromEntries(params) });
    
    try {
      const response = await api.get(endpoint, { params });
      logApiResponse('GET', endpoint, response.data, response.status);
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  async downloadAttachment(mailId: number, attachmentId: number): Promise<Blob> {
    const endpoint = `/api/mails/${mailId}/attachments/${attachmentId}`;
    
    logApiCall('GET', endpoint);
    
    try {
      const response = await api.get(endpoint, { 
        responseType: 'blob' 
      });
      
      // 바이너리 데이터는 로깅하지 않음
      console.log(`✅ API 응답: GET ${endpoint}`, { 
        상태코드: response.status, 
        콘텐츠타입: response.headers['content-type'],
        콘텐츠길이: response.headers['content-length']
      });
      
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

};
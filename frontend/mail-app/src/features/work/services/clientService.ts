import { api } from '@/shared/lib/axiosInstance';
import {
  Client,
  ClientDetail,
  ClientResponse,
} from '../types/clients';

interface GetClientsParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: number;
  companyId: number;
}

interface EmailOCR {
  licenseNum: string;
  address: string;
  corpName: string;
  representative: string;
  businessType: string;
  businessItem: string;
  success: boolean;
}

// S3 파일 업로드 응답 타입
interface S3UploadResponse {
  s3Key: string;
}

api.interceptors.request.use(config => {
  console.log('[API 요청]', config.method, config.url, config.data || config.params);
  return config;
});

api.interceptors.response.use(response => {
  console.log('[API 응답]', response.config.url, response.data);
  return response;
});

export const clientService = {
  
  // 파일 형식 검증
  validateBusinessLicense: (file: File | null): boolean => {
    if (!file) return false;
    
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png'
    ];
    const fileType = file.type;
    
    return allowedTypes.includes(fileType);
  },
  
  // S3에 파일 업로드
  uploadBusinessLicense: async (file: File): Promise<S3UploadResponse> => {
    if (!clientService.validateBusinessLicense(file)) {
      throw new Error('사업자등록증은 PDF, JPG, JPEG 또는 PNG 형식만 업로드 가능합니다.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('파일 업로드 시작:', file.name);
      
      // /documents 엔드포인트로 파일 업로드
      const response = await api.post<S3UploadResponse>('/api/s3/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('파일 업로드 완료:', response.data);
      return response.data;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      throw new Error('파일 업로드에 실패했습니다.');
    }
  },
  
  // OCR 처리
  uploadBusinessLicenseOCR: async (file: File): Promise<EmailOCR> => {
    // 파일 형식 검증
    if (!clientService.validateBusinessLicense(file)) {
      throw new Error('사업자등록증은 PDF, JPG, JPEG 또는 PNG 형식만 업로드 가능합니다.');
    }
  
    const formData = new FormData();
    formData.append('file', file);
    
    // OCR 처리 엔드포인트로 POST 요청
    const response = await api.post<EmailOCR>('/api/erp/clients/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // 사업자등록증 다운로드 함수
  downloadBusinessLicense: async (businessLicenseUrl: string): Promise<void> => {
    try {
      console.log('다운로드 시작:', businessLicenseUrl);
      if (!businessLicenseUrl) {
        throw new Error('다운로드할 사업자등록증 파일 경로가 없습니다.');
      }

      // 파일명 추출 (URL의 마지막 부분을 사용)
      const urlParts = businessLicenseUrl.split('/');
      let filename = urlParts[urlParts.length - 1];
      
      // URL에서 파일명 디코딩 및 특수문자 처리
      try {
        filename = decodeURIComponent(filename);
        console.log('파일명 추출:', filename);
      } catch (e) {
        console.error('파일명 디코딩 오류:', e);
        filename = '사업자등록증.pdf'; // 기본 파일명
      }
      
      // 파일 확장자로 MIME 타입 결정
      const ext = filename.split('.').pop()?.toLowerCase();
      let contentType = 'application/octet-stream'; // 기본값
      
      if (ext === 'pdf') contentType = 'application/pdf';
      else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
      else if (ext === 'png') contentType = 'image/png';
      console.log('파일 확장자에 따른 Content-Type:', contentType);

      // fetch 요청
      const response = await fetch(businessLicenseUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log('응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Content-Disposition 헤더에서 파일명 추출 (우선 적용)
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        console.log('Content-Disposition:', contentDisposition);
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          try {
            filename = decodeURIComponent(filename);
            console.log('헤더에서 추출한 파일명:', filename);
          } catch (e) {
            console.error('파일명 디코딩 오류:', e);
          }
        }
      }
      
      // ArrayBuffer로 데이터 가져오기
      const arrayBuffer = await response.arrayBuffer();
      console.log('다운로드된 데이터 크기:', arrayBuffer.byteLength, 'bytes');
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('다운로드된 파일 데이터가 없습니다.');
      }
      
      // 서버에서 받은 Content-Type 확인 (로그용)
      const serverContentType = response.headers.get('content-type');
      console.log('서버에서 받은 Content-Type:', serverContentType);
      console.log('실제 사용할 Content-Type:', contentType);
      
      // Blob 생성 시 파일 확장자로 판단한 contentType 사용
      const blob = new Blob([arrayBuffer], { type: contentType });
      console.log('생성된 Blob 크기:', blob.size, 'bytes');
      console.log('생성된 Blob 타입:', blob.type);
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      console.log('다운로드 링크 생성:', url);
      console.log('다운로드 파일명:', filename);
      
      document.body.appendChild(link);
      link.click();
      
      // 클린업
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
        console.log('다운로드 완료 및 리소스 정리');
      }, 100);
    } catch (error) {
      console.error('사업자등록증 다운로드 오류:', error);
      throw new Error('사업자등록증 다운로드에 실패했습니다.');
    }
  },
  
  // 거래처 목록 조회
  getClients: async (params: GetClientsParams) => {
    const response = await api.get<ClientResponse>(`/api/erp/companies/${params.companyId}/clients`, {
      params: {
        ...(params?.query && { query: params.query }),
        ...(params?.page && { page: params.page - 1 }),
        ...(params?.size && { size: params.size })
      }
    });

    return response.data;
  },

  // 거래처 상세 조회
  getClient: async (id: string) => {
    console.log('거래처 상세 조회 요청:', id);
    const response = await api.get<ClientDetail>(`/api/erp/clients/${id}`);
    console.log('거래처 상세 조회 응답:', response.data);
    return response.data;
  },

  // 거래처 생성
  createClient: async (companyId: number, groupId: number, client: ClientDetail) => {
    const requestData = {
      companyId: companyId,
      groupId: groupId,
      licenseNum: client.licenseNum,
      corpName: client.corpName,
      representative: client.representative,
      phoneNum: client.phoneNum,
      email: client.email,
      address: client.address,
      businessType: client.businessType,
      businessItem: client.businessItem,
      businessLicenseUrl: client.businessLicenseUrl,
      businessLicenseName: client.businessLicenseName,
    };
    console.log('거래처 생성 요청:', requestData);
    const response = await api.post<Client>('/api/erp/clients', requestData);
    console.log('거래처 생성 응답:', response.data);
    return response.data;
  },

  // 거래처 수정
  updateClient: async (id: string, client: ClientDetail) => {
    const requestData = {
      licenseNum: client.licenseNum,
      corpName: client.corpName,
      representative: client.representative,
      phoneNum: client.phoneNum,
      email: client.email,
      address: client.address,
      businessType: client.businessType,
      businessItem: client.businessItem,
      businessLicenseUrl: client.businessLicenseUrl,
      businessLicenseName: client.businessLicenseName
    };

    const response = await api.put<ClientDetail>(`/api/erp/clients/${id}`, requestData);
    return response.data;
  },

  // 거래처 삭제
  deleteClient: async (id: number) => {
    await api.delete(`/api/erp/clients/${id}`);
  },

  // 선택된 거래처들 삭제 (옵션)
  deleteClients: async (ids: number[]) => {
    await api.post('/api/erp/clients/delete', {
      ids: ids
    });
  }
};
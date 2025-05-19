import { api } from '@/shared/lib/axiosInstance';
import { AssistantsParams, AssistantsResponse, AssistantType, RegisterClientRequest, TemporaryClientDetail, TemporaryPurchaseOrderDetail, TemporaryQuoteDetail, TemporaryScheduleDetail, UpdateTemporaryClientRequest, UpdateTemporaryPurchaseOrderRequest, UpdateTemporaryQuoteRequest } from '../types/home';

// 로깅 함수
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
  console.error(`❌ API 에러: ${method} ${endpoint}`, {
    상태코드: error.response?.status,
    에러메시지: error.message,
    에러데이터: error.response?.data
  });
};

export const homeService = {
  /**
   * AI 비서 항목 목록을 조회합니다.
   */
  async getAssistants(params: AssistantsParams = {}): Promise<AssistantsResponse> {
    const { page = 0, size = 10, sort = 0 } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    queryParams.append('sort', sort.toString());
    
    const endpoint = `/api/assistants?${queryParams.toString()}`;
    
    logApiCall('GET', endpoint, params as Record<string, unknown>);
    
    try {
      const response = await api.get<AssistantsResponse>(endpoint);
      logApiResponse('GET', endpoint, response.data as unknown as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
  async getTemporarySchedule(temporaryScheduleId: number): Promise<TemporaryScheduleDetail> {
    const endpoint = `/api/assistants/schedules/${temporaryScheduleId}`;
    
    logApiCall('GET', endpoint, { temporaryScheduleId });
    
    try {
      const response = await api.get<TemporaryScheduleDetail>(endpoint);
      logApiResponse('GET', endpoint, response.data as unknown as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  async updateTemporarySchedule(scheduleData: {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
    temporaryScheduleId: number;
  }): Promise<TemporaryScheduleDetail> {
    const endpoint = `/api/assistants/schedules/${scheduleData.temporaryScheduleId}`;
    
    logApiCall('PATCH', endpoint, scheduleData);
    
    try {
      const response = await api.patch<TemporaryScheduleDetail>(endpoint, scheduleData);
      logApiResponse('PATCH', endpoint, response.data as unknown as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('PATCH', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  async registerSchedule(scheduleData: {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
    temporaryScheduleId: number;
  }): Promise<void> {
    const endpoint = `/api/assistants/schedules/register`;
    
    logApiCall('POST', endpoint, scheduleData);
    
    try {
      const response = await api.post(endpoint, scheduleData);
      logApiResponse('POST', endpoint, response.data as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('POST', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  async deleteAssistant(id: number, type: AssistantType): Promise<void> {
    let endpoint = '';
    
    // 타입에 따라 다른 엔드포인트 사용
    switch (type) {
      case 'SCHEDULE':
        endpoint = `/api/assistants/schedules/${id}`;
        break;
      case 'CLIENT':
        endpoint = `/api/assistants/clients/${id}`;
        break;
      case 'PURCHASE_ORDER':
        endpoint = `/api/assistants/purchase-orders/${id}`;
        break;
      case 'QUOTE':
        endpoint = `/api/assistants/quotes/${id}`;
        break;
      default:
        throw new Error(`지원하지 않는 타입입니다: ${type}`);
    }
    
    logApiCall('DELETE', endpoint);
    
    try {
      const response = await api.delete(endpoint);
      logApiResponse('DELETE', endpoint, response.data as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('DELETE', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },

  async getTemporaryPurchaseOrder(temporaryPurchaseOrderId: number | null): Promise<TemporaryPurchaseOrderDetail | null> {
    if (temporaryPurchaseOrderId === null) {
      return null;
    }
    
    const endpoint = `/api/assistants/purchase-orders/${temporaryPurchaseOrderId}`;
    
    logApiCall('GET', endpoint);
    
    try {
      const response = await api.get<TemporaryPurchaseOrderDetail>(endpoint);
      logApiResponse('GET', endpoint, response.data as unknown as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('GET', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
  async updateTemporaryPurchaseOrder(
    temporaryPurchaseOrderId: number,
    data: UpdateTemporaryPurchaseOrderRequest
  ): Promise<TemporaryPurchaseOrderDetail> {
    const endpoint = `/api/assistants/purchase-orders/${temporaryPurchaseOrderId}`;
    
    logApiCall('PATCH', endpoint, data as Record<string, unknown>);
    
    try {
      const response = await api.patch<TemporaryPurchaseOrderDetail>(endpoint, data);
      logApiResponse('PATCH', endpoint, response.data as unknown as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('PATCH', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
  async registerPurchaseOrder(data: {
    id: number;
    clientId: number;
    companyId: number;
    manager?: string;
    managerNumber?: string;
    paymentTerm?: string;
    deliverAt: string;
    shippingAddress?: string;
    products: Array<{
      productId: number;
      count: number;
    }>;
  }): Promise<void> {
    const endpoint = `/api/assistants/purchase-orders/register`;
    
    logApiCall('POST', endpoint, data as Record<string, unknown>);
    
    try {
      const response = await api.post(endpoint, data);
      logApiResponse('POST', endpoint, response.data as Record<string, unknown>, response.status);
      return response.data;
    } catch (error) {
      logApiError('POST', endpoint, error as Record<string, unknown> & { 
        response?: { status?: number, data?: unknown }, 
        message?: string 
      });
      throw error;
    }
  },
  
    // 임시 견적서 조회 함수 추가
    async getTemporaryQuote(temporaryQuoteId: number | null): Promise<TemporaryQuoteDetail | null> {
      if (temporaryQuoteId === null) {
        return null;
      }
      
      const endpoint = `/api/assistants/quotes/${temporaryQuoteId}`;
      
      logApiCall('GET', endpoint);
      
      try {
        const response = await api.get<TemporaryQuoteDetail>(endpoint);
        logApiResponse('GET', endpoint, response.data as unknown as Record<string, unknown>, response.status);
        return response.data;
      } catch (error) {
        logApiError('GET', endpoint, error as Record<string, unknown> & { 
          response?: { status?: number, data?: unknown }, 
          message?: string 
        });
        throw error;
      }
    },
    
    // 임시 견적서 업데이트 함수 추가
    async updateTemporaryQuote(
      temporaryQuoteId: number,
      data: UpdateTemporaryQuoteRequest
    ): Promise<TemporaryQuoteDetail> {
      const endpoint = `/api/assistants/quotes/${temporaryQuoteId}`;
      
      logApiCall('PATCH', endpoint, data as Record<string, unknown>);
      
      try {
        const response = await api.patch<TemporaryQuoteDetail>(endpoint, data);
        logApiResponse('PATCH', endpoint, response.data as unknown as Record<string, unknown>, response.status);
        return response.data;
      } catch (error) {
        logApiError('PATCH', endpoint, error as Record<string, unknown> & { 
          response?: { status?: number, data?: unknown }, 
          message?: string 
        });
        throw error;
      }
    },
    
    // 견적서 등록 함수 추가
    async registerQuote(data: {
      id: number;
      clientId: number;
      companyId: number;
      manager?: string;
      managerNumber?: string;
      shippingAddress?: string;
      products: Array<{
        productId: number;
        count: number;
      }>;
    }): Promise<void> {
      const endpoint = `/api/assistants/quotes/register`;
      
      logApiCall('POST', endpoint, data as Record<string, unknown>);
      
      try {
        const response = await api.post(endpoint, data);
        logApiResponse('POST', endpoint, response.data as Record<string, unknown>, response.status);
        return response.data;
      } catch (error) {
        logApiError('POST', endpoint, error as Record<string, unknown> & { 
          response?: { status?: number, data?: unknown }, 
          message?: string 
        });
        throw error;
      }
    },
  
    // 임시 거래처 조회 함수 추가
    async getTemporaryClient(temporaryClientId: number | null): Promise<TemporaryClientDetail | null> {
      if (temporaryClientId === null) {
        return null;
      }
      
      const endpoint = `/api/assistants/clients/${temporaryClientId}`;
      
      logApiCall('GET', endpoint);
      
      try {
        const response = await api.get<TemporaryClientDetail>(endpoint);
        logApiResponse('GET', endpoint, response.data as unknown as Record<string, unknown>, response.status);
        return response.data;
      } catch (error) {
        logApiError('GET', endpoint, error as Record<string, unknown> & { 
          response?: { status?: number, data?: unknown }, 
          message?: string 
        });
        throw error;
      }
    },

    // 임시 거래처 업데이트 함수 추가
    async updateTemporaryClient(
      temporaryClientId: number,
      data: UpdateTemporaryClientRequest
    ): Promise<TemporaryClientDetail> {
      const endpoint = `/api/assistants/clients/update/${temporaryClientId}`;
      
      logApiCall('PATCH', endpoint, data as Record<string, unknown>);
      
      try {
        const response = await api.patch<TemporaryClientDetail>(endpoint, data);
        logApiResponse('PATCH', endpoint, response.data as unknown as Record<string, unknown>, response.status);
        return response.data;
      } catch (error) {
        logApiError('PATCH', endpoint, error as Record<string, unknown> & { 
          response?: { status?: number, data?: unknown }, 
          message?: string 
        });
        throw error;
      }
    },

    // 거래처 등록 함수 추가
    async registerClient(data: RegisterClientRequest): Promise<void> {
      const endpoint = `/api/assistants/clients/register`;
      
      logApiCall('POST', endpoint, data as unknown as Record<string, unknown>);
      
      try {
        const response = await api.post(endpoint, data);
        logApiResponse('POST', endpoint, response.data as Record<string, unknown>, response.status);
        return response.data;
      } catch (error) {
        logApiError('POST', endpoint, error as Record<string, unknown> & { 
          response?: { status?: number, data?: unknown }, 
          message?: string 
        });
        throw error;
      }
    },
};
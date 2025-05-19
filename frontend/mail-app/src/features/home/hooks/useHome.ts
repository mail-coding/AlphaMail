import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeService } from '../services/homeService';
import { homeQueryKeys } from '../constants/queryKeys';
import { AssistantsParams, AssistantType, RegisterClientRequest, UpdateTemporaryClientRequest, UpdateTemporaryPurchaseOrderRequest, UpdateTemporaryQuoteRequest } from '../types/home';
import { toast } from 'react-toastify';

export const useHome = () => {
  const queryClient = useQueryClient();
  
  // AI 비서 항목 목록 조회 쿼리
  const useAssistants = (params: AssistantsParams = {}) => {
    return useQuery({
      queryKey: [...homeQueryKeys.assistants, params],
      queryFn: () => homeService.getAssistants(params),
      staleTime: 1000 * 60 * 5, // 5분
    });
  };
    
  const useTemporarySchedule = (temporaryScheduleId: number | null) => {
    return useQuery({
      queryKey: temporaryScheduleId ? homeQueryKeys.temporarySchedule(temporaryScheduleId) : [],
      queryFn: () => temporaryScheduleId ? homeService.getTemporarySchedule(temporaryScheduleId) : null,
      enabled: !!temporaryScheduleId,
      staleTime: 1000 * 60 * 5, // 5분
    });
  };

    // 임시 일정 저장 뮤테이션
    const useUpdateTemporarySchedule = () => {
      return useMutation({
        mutationFn: (scheduleData: {
          name: string;
          startTime: string;
          endTime: string;
          description: string;
          temporaryScheduleId: number;
        }) => homeService.updateTemporarySchedule(scheduleData),
        onSuccess: (data) => {
          // 저장 성공 시 해당 일정 쿼리 무효화
          queryClient.invalidateQueries({ 
            queryKey: homeQueryKeys.temporarySchedule(data.temporaryScheduleId) 
          });
          toast.success('일정이 임시저장되었습니다.');
        },
        onError: () => {
          toast.error('일정 임시저장에 실패했습니다.');
        }
      });
    };
  

      // 일정 등록 뮤테이션
  const useRegisterSchedule = () => {
    return useMutation({
      mutationFn: (scheduleData: {
        name: string;
        startTime: string;
        endTime: string;
        description: string;
        temporaryScheduleId: number;
      }) => homeService.registerSchedule(scheduleData),
      onSuccess: () => {
        // 등록 성공 시 AI 비서 목록 쿼리 무효화
        queryClient.invalidateQueries({ 
          queryKey: homeQueryKeys.assistants
        });
        toast.success('일정이 등록되었습니다.');
      },
      onError: () => {
        toast.error('일정 등록에 실패했습니다.');
      }
    });
  };

    // AI 비서 항목 삭제 뮤테이션
    const useDeleteAssistant = () => {
      return useMutation({
        mutationFn: ({ id, type }: { id: number, type: AssistantType }) => 
          homeService.deleteAssistant(id, type),
        onSuccess: () => {
          // 삭제 성공 시 AI 비서 목록 쿼리 무효화
          queryClient.invalidateQueries({ 
            queryKey: homeQueryKeys.assistants
          });
          toast.success('항목이 삭제되었습니다.');
        },
        onError: () => {
          toast.error('항목 삭제에 실패했습니다.');
        }
      });
    };  

      // 임시 발주서 조회 쿼리
  const useTemporaryPurchaseOrder = (temporaryPurchaseOrderId: number | null) => {
    return useQuery({
      queryKey: homeQueryKeys.temporaryPurchaseOrder(temporaryPurchaseOrderId),
      queryFn: () => homeService.getTemporaryPurchaseOrder(temporaryPurchaseOrderId),
      enabled: temporaryPurchaseOrderId !== null,
      staleTime: 1000 * 60 * 5, // 5분
    });
  };

  const useEmailByType = (type: AssistantType, id: number | null) => {
    return useQuery({
      queryKey: homeQueryKeys.emailByType(type, id),
      queryFn: async () => {
        if (id === null) return null;
        
        // 태그에 따라 다른 API 호출
        switch (type) {
          case 'SCHEDULE':
            return homeService.getTemporarySchedule(id);
          case 'PURCHASE_ORDER':
            return homeService.getTemporaryPurchaseOrder(id);
          case 'CLIENT':
            return homeService.getTemporaryClient(id);
          case 'QUOTE':
            return homeService.getTemporaryQuote(id);
          default:
            throw new Error(`지원하지 않는 타입입니다: ${type}`);
        }
      },
      enabled: id !== null,
      staleTime: 1000 * 60 * 5, // 5분
    });
  };

  const useUpdateTemporaryPurchaseOrder = () => {
    return useMutation({
      mutationFn: ({ 
        id, 
        data 
      }: { 
        id: number, 
        data: UpdateTemporaryPurchaseOrderRequest 
      }) => homeService.updateTemporaryPurchaseOrder(id, data),
      onSuccess: (data) => {
        // 업데이트 성공 시 해당 발주서 쿼리 무효화
        queryClient.invalidateQueries({ 
          queryKey: homeQueryKeys.temporaryPurchaseOrder(data.id) 
        });
        toast.success('발주서가 임시저장되었습니다.');
      },
      onError: () => {
        toast.error('발주서 임시저장에 실패했습니다.');
      }
    });
  };
  
  const useRegisterPurchaseOrder = () => {
    return useMutation({
      mutationFn: (data: {
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
      }) => homeService.registerPurchaseOrder(data),
      onSuccess: () => {
        // 등록 성공 시 AI 비서 목록 쿼리 무효화
        queryClient.invalidateQueries({ 
          queryKey: homeQueryKeys.assistants
        });
        toast.success('발주서가 등록되었습니다.');
      },
      onError: () => {
        toast.error('발주서 등록에 실패했습니다.');
      }
    });
  };
  
    // 임시 견적서 조회 쿼리
    const useTemporaryQuote = (temporaryQuoteId: number | null) => {
      return useQuery({
        queryKey: homeQueryKeys.temporaryQuote(temporaryQuoteId),
        queryFn: () => homeService.getTemporaryQuote(temporaryQuoteId),
        enabled: temporaryQuoteId !== null,
        staleTime: 1000 * 60 * 5, // 5분
      });
    };
    
    // 임시 견적서 업데이트 뮤테이션
    const useUpdateTemporaryQuote = () => {
      return useMutation({
        mutationFn: ({ 
          id, 
          data 
        }: { 
          id: number, 
          data: UpdateTemporaryQuoteRequest 
        }) => homeService.updateTemporaryQuote(id, data),
        onSuccess: (data) => {
          // 업데이트 성공 시 해당 견적서 쿼리 무효화
          queryClient.invalidateQueries({ 
            queryKey: homeQueryKeys.temporaryQuote(data.id) 
          });
          toast.success('견적서가 임시저장되었습니다.');
        },
        onError: () => {
          toast.error('견적서 임시저장에 실패했습니다.');
        }
      });
    };
    
    // 견적서 등록 뮤테이션
    const useRegisterQuote = () => {
      return useMutation({
        mutationFn: (data: {
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
        }) => homeService.registerQuote(data),
        onSuccess: () => {
          // 등록 성공 시 AI 비서 목록 쿼리 무효화
          queryClient.invalidateQueries({ 
            queryKey: homeQueryKeys.assistants
          });
          toast.success('견적서가 등록되었습니다.');
        },
        onError: () => {
          toast.error('견적서 등록에 실패했습니다.');
        }
      });
    };
  
    // 임시 거래처 조회 쿼리
    const useTemporaryClient = (temporaryClientId: number | null) => {
      return useQuery({
        queryKey: homeQueryKeys.temporaryClient(temporaryClientId),
        queryFn: () => homeService.getTemporaryClient(temporaryClientId),
        enabled: temporaryClientId !== null,
        staleTime: 1000 * 60 * 5, // 5분
      });
    };

    // 임시 거래처 업데이트 뮤테이션
    const useUpdateTemporaryClient = () => {
      return useMutation({
        mutationFn: ({ 
          id, 
          data 
        }: { 
          id: number, 
          data: UpdateTemporaryClientRequest 
        }) => homeService.updateTemporaryClient(id, data),
        onSuccess: (data) => {
          // 업데이트 성공 시 해당 거래처 쿼리 무효화
          queryClient.invalidateQueries({ 
            queryKey: homeQueryKeys.temporaryClient(data.id) 
          });
          toast.success('거래처가 임시저장되었습니다.');
        },
        onError: () => {
          toast.error('거래처 임시저장에 실패했습니다.');
        }
      });
    };

    // 거래처 등록 뮤테이션
    const useRegisterClient = () => {
      return useMutation({
        mutationFn: (data: RegisterClientRequest) => homeService.registerClient(data),
        onSuccess: () => {
          // 등록 성공 시 AI 비서 목록 쿼리 무효화
          queryClient.invalidateQueries({ 
            queryKey: homeQueryKeys.assistants
          });
          toast.success('거래처가 등록되었습니다.');
        },
        onError: () => {
          toast.error('거래처 등록에 실패했습니다.');
        }
      });
    };
    
  return {
    useAssistants,
    useTemporarySchedule,
    useUpdateTemporarySchedule,
    useRegisterSchedule,
    useDeleteAssistant,
    useTemporaryPurchaseOrder,
    useEmailByType,
    useUpdateTemporaryPurchaseOrder,
    useRegisterPurchaseOrder,
    useTemporaryQuote,
    useUpdateTemporaryQuote,
    useRegisterQuote,
    useTemporaryClient,
    useUpdateTemporaryClient,
    useRegisterClient
  };
};
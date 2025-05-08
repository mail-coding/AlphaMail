import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ScheduleResponse } from '../types/schedule';
import { api } from '@/shared/lib/axiosInstance';
import { AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';

const scheduleQueryClient = new QueryClient();

const toISOStringWithoutZ = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, '');
};

export const scheduleService = {
  getSchedulesForMonthRange: (selectedMonth: Date) => {
    console.log('scheduleService - 월간 일정 요청:', {
      year: selectedMonth.getFullYear(),
      month: selectedMonth.getMonth()
    });
    
    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 2, 0);
    const startDateString = toISOStringWithoutZ(startDate);
    const endDateString = toISOStringWithoutZ(endDate);
    
    console.log('scheduleService - 월간 일정 요청:', {
      startTime: startDateString,
      endTime: endDateString
    });
    
    return api.get<ScheduleResponse>('/api/schedules', {
      params: { 
        startTime: startDateString,
        endTime: endDateString
      }
    }).then((response: AxiosResponse<ScheduleResponse>) => {
      console.log('scheduleService - API 응답:', response.data);

      // API 응답을 Schedule[] 타입으로 변환
      const schedules: Schedule[] = (response.data?.schedules || []).map(item => ({
        id: String(item.id),
        name: item.name,
        created_at: new Date(item.createdAt + 'Z'),
        start_time: new Date(item.startTime + 'Z'),
        end_time: new Date(item.endTime + 'Z'),
        is_done: item.isDone,
        description: item.description
      }));
      
      return { data: schedules };
    }).catch((error: Error) => {
      console.error('scheduleService - API 오류:', error);
      throw error;
    });
  },

  getSchedulesForWeek: (selectedDate: Date) => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startDateString = toISOStringWithoutZ(startOfWeek);
    const endDateString = toISOStringWithoutZ(endOfWeek);

    console.log('scheduleService - 주간 일정 요청:', {
      startTime: startDateString,
      endTime: endDateString
    });

    return api.get<ScheduleResponse>('/api/schedules', {
      params: { 
        startTime: startDateString, 
        endTime: endDateString
       }
    }).then((response: AxiosResponse<ScheduleResponse>) => {
      console.log('주간 일정 응답:', response.data);
      
      const schedules: Schedule[] = (response.data?.schedules || []).map(item => ({
        id: String(item.id),
        name: item.name,
        created_at: new Date(item.createdAt + 'Z'),
        start_time: new Date(item.startTime + 'Z'),
        end_time: new Date(item.endTime + 'Z'),
        is_done: item.isDone,
        description: item.description
      }));
      
      return { data: schedules };
    });
  },

  getSchedulesForSearch: (query: string) => {
    return api.get<ScheduleResponse>('/api/schedules', {
      params: { query }
    }).then((response: AxiosResponse<ScheduleResponse>) => {
      const schedules: Schedule[] = response.data.schedules.map(item => ({
        id: String(item.id),
        name: item.name,
        created_at: new Date(item.createdAt + 'Z'),
        start_time: new Date(item.startTime + 'Z'),
        end_time: new Date(item.endTime + 'Z'),
        is_done: item.isDone,
        description: item.description
      }));
      
      return { data: schedules };
    });
  },

  // 스케줄 생성
  createSchedule: async (schedule: CreateScheduleRequest): Promise<Schedule> => {
    const requestData = {
      name: schedule.name,
      startTime: schedule.start_time.toISOString(),
      endTime: schedule.end_time.toISOString(),
      description: schedule.description
    };

    console.log('scheduleService - 생성 요청 데이터 : ', requestData);

    const response = await api.post('/api/schedules', requestData);
    
    // 생성 후 캐시 무효화
    await scheduleQueryClient.invalidateQueries({ 
      queryKey: ['schedules'],
      refetchType: 'all'
    });
    
    return {
      id: String(response.data.id),
      name: response.data.name,
      created_at: new Date(response.data.createdAt),
      start_time: new Date(response.data.startTime),
      end_time: new Date(response.data.endTime),
      is_done: response.data.isDone,
      description: response.data.description
    };
  },

  // 스케줄 수정
  updateSchedule: async (schedule: UpdateScheduleRequest): Promise<Schedule> => {
    const requestData = {
      name: schedule.name,
      startTime: schedule.start_time.toISOString(),
      endTime: schedule.end_time.toISOString(),
      description: schedule.description,
      isDone: schedule.is_done
    };

    console.log('scheduleService - 수정 요청 데이터 : ', requestData);
    const response = await api.put(`/api/schedules/${schedule.id}`, requestData);
    
    // 수정 후 캐시 무효화
    await scheduleQueryClient.invalidateQueries({ 
      queryKey: ['schedules'],
      refetchType: 'all'
    });
    
    return {
      id: String(response.data.id),
      name: response.data.name,
      created_at: new Date(response.data.createdAt),
      start_time: new Date(response.data.startTime),
      end_time: new Date(response.data.endTime),
      is_done: response.data.isDone,
      description: response.data.description
    };
  },

  // 스케줄 삭제
  deleteSchedule: async (id: string) => {
    const response = await api.delete(`/api/schedules/${id}`);
    
    // 삭제 후 캐시 무효화
    await scheduleQueryClient.invalidateQueries({ 
      queryKey: ['schedules'],
      refetchType: 'all'
    });
    
    return response.data;
  },

  // 스케줄 완료 변경
  patchSchedule: async (id: string, isCompleted: boolean): Promise<void> => {
    await api.patch(`/api/schedules/${id}/toggles`, { isDone: isCompleted });
    
    // 완료 상태 변경 후 캐시 무효화
    await scheduleQueryClient.invalidateQueries({ 
      queryKey: ['schedules'],
      refetchType: 'all'
    });
  }
}; 
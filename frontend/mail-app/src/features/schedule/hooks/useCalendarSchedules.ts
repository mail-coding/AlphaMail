import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '../services/scheduleService';
import { Schedule } from '../types/schedule';
import React from 'react';

export const useCalendarSchedules = (selectedMonth: Date) => {
  const query = useQuery<{ data: Schedule[] }>({
    queryKey: ['schedules', 'calendar', selectedMonth.getFullYear(), selectedMonth.getMonth()],
    queryFn: async () => {
      console.log('useCalendarSchedules - API 요청 시작:', {
        year: selectedMonth.getFullYear(),
        month: selectedMonth.getMonth()
      });
      
      const response = await scheduleService.getSchedulesForMonthRange(selectedMonth);
      
      console.log('useCalendarSchedules - API 응답:', response);
      
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 0, // 즉시 갱신
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  React.useEffect(() => {
    if (query.data) {
      console.log('useCalendarSchedules - 데이터 로드 성공:', query.data);
    }
    if (query.error) {
      console.error('useCalendarSchedules - 데이터 로드 실패:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

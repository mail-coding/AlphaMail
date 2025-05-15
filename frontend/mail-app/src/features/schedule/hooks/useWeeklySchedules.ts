import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '../services/scheduleService';
import { Schedule } from '../types/schedule';

export const useWeeklySchedules = (selectedDate: Date) => {
  return useQuery<{ data: Schedule[] }>({
    queryKey: ['schedules', 'week', selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()],
    queryFn: () => scheduleService.getSchedulesForWeek(selectedDate),
    placeholderData: (previousData) => previousData,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

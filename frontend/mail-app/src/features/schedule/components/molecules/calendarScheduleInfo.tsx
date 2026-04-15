import React from 'react';
import { Schedule } from '@/features/schedule/types/schedule';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/features/schedule/services/scheduleService';

interface CalendarScheduleInfoProps {
  schedule: Schedule;
}

export const CalendarScheduleInfo: React.FC<CalendarScheduleInfoProps> = ({ schedule }) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      scheduleService.patchSchedule(id, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['calendarSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['weeklySchedules'] });
    }
  });


  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    if (updateMutation.isPending) return; 
    
    updateMutation.mutate({
      id: schedule.id,
      isCompleted: !schedule.is_done
    });
  };

  return (
    <div 
      className="flex items-center gap-1 mb-2 cursor-pointer p-1 rounded hover:bg-gray-50"
      onClick={handleToggleComplete} // 전체 컴포넌트 클릭 시 토글
    >
      <input
        type="checkbox"
        checked={schedule.is_done}
        onChange={(e) => {
          e.stopPropagation(); // 체크박스 클릭 시 이벤트 버블링 방지
          handleToggleComplete(e as unknown as React.MouseEvent);
        }}
        className="w-4 h-4 accent-blue-400 custom-checkbox"
        disabled={updateMutation.isPending}
      />
      <span className="text-gray-400 text-xs w-[90px] text-right whitespace-nowrap">
        {format(new Date(schedule.start_time), 'MM/dd HH:mm')}
      </span>
      <span
        className={`ml-2 flex-1 truncate text-xs ${
          schedule.is_done ? 'text-gray-300 line-through' : 'text-gray-800'
        }`}
      >
        {schedule.name}
      </span>
    </div>
  );
};

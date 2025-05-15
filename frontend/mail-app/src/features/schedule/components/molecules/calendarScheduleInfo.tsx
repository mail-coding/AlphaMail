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
    }
  });

  const handleCheckboxChange = () => {
    updateMutation.mutate({
      id: schedule.id,
      isCompleted: !schedule.is_done
    });
  };

  return (
    <div className="flex items-center gap-1 mb-2">
      <input
        type="checkbox"
        checked={schedule.is_done}
        onChange={handleCheckboxChange}
        className="w-4 h-4 accent-blue-400"
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

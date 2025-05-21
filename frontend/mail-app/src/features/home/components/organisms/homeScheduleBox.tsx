import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { useTodaySchedules } from '@/features/home/hooks/useTodaySchedules';
import { scheduleService } from '@/features/schedule/services/scheduleService';
import { Schedule } from '@/features/schedule/types/schedule';

export const HomeScheduleBox: React.FC = () => {
  const { data: scheduleData, isLoading, error, refetch } = useTodaySchedules();
  const schedules = scheduleData?.data || [];

  // 일정 완료 상태 변경 핸들러
  const handleToggleComplete = async (id: string, isDone: boolean) => {
    try {
      await scheduleService.patchSchedule(id, !isDone);
      // 상태 변경 후 데이터 다시 가져오기
      refetch();
    } catch (error) {
      console.error('일정 상태 변경 실패:', error);
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="mb-4">
        <Typography variant="titleMedium">오늘의 일정</Typography>
      </div>
      {isLoading ? (
        <div className="text-center py-4">
          <Typography variant="body">로딩 중...</Typography>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <Typography variant="body">일정을 불러오는데 실패했습니다.</Typography>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Typography variant="body">오늘의 일정이 없습니다.</Typography>
        </div>
      ) : (
        <div className="space-y-3 border border-gray-200 p-3 pl-5 rounded-md">
          {schedules.map((schedule: Schedule) => (
            <div 
              key={schedule.id} 
              className={`flex items-center `}
            >
              <input 
                type="checkbox" 
                className={`mr-2 ${schedule.is_done ? 'text-gray-400' : ''}`}
                checked={schedule.is_done}
                onChange={() => handleToggleComplete(schedule.id, schedule.is_done)}
              />
              <div className="flex items-center">
                <div className={`text-sm ${schedule.is_done ? 'text-blue-200' : 'text-blue-500'} pr-2`}>
                  {formatTime(schedule.start_time)}
                </div>
                <Typography 
                  variant="titleSmall" 
                  className={schedule.is_done ? 'text-[#9C9C9C]' : 'text-black-400'}
                >
                  {schedule.name}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
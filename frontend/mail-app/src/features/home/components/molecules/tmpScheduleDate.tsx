import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { useHomeStore } from '../../stores/useHomeStore';

export const TmpScheduleDate: React.FC = () => {
  const { 
    schedule, 
    scheduleErrors,
    setScheduleStartDate,
    setScheduleEndDate,
    setScheduleStartTime,
    setScheduleEndTime
  } = useHomeStore();
  
  // 오늘 날짜 계산 (YYYY-MM-DD 형식)
  const today = new Date().toISOString().split('T')[0];
  
  // 종료일 최소값 계산 (시작일 이후만 선택 가능)
  const minEndDate = schedule.startDate || today;
  
  // 종료일 선택 가능 여부 (시작일과 시작시간이 모두 설정되어야 함)
  const canSelectEndDate = !!(schedule.startDate && schedule.startTime);
  
  // 종료시간 선택 가능 여부 (시작일, 시작시간, 종료일이 모두 설정되어야 함)
  const canSelectEndTime = !!(schedule.startDate && schedule.startTime && schedule.endDate);
  
  return (
    <div className="mb-4">
      <Typography variant="titleSmall" className="text-gray-700 mb-1 flex items-center">
        일시 <span className="text-red-500 ml-1">*</span>
      </Typography>
      <div className="flex items-center space-x-2">
    
        <div className="flex items-center">
        <Typography>
          <input
            type="date"
            value={schedule.startDate}
            onChange={(e) => setScheduleStartDate(e.target.value)}
            min={today} // 오늘 이후 날짜만 선택 가능
            className="border border-gray-300 rounded-sm h-[30px] px-2 text-sm"
            />
            </Typography>
        </div>
        <div className="flex items-center">
        <Typography>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) => setScheduleStartTime(e.target.value)}
            className="border border-gray-300 rounded-sm h-[30px] px-2 text-sm"
          />
           </Typography>
        </div>
        <span className="text-gray-500">~</span>
        <div className="flex items-center">
        <Typography>
          <input
            type="date"
            value={schedule.endDate}
            onChange={(e) => setScheduleEndDate(e.target.value)}
            min={minEndDate}
            disabled={!canSelectEndDate}
            className={`border border-gray-300 rounded-sm h-[30px] px-2 text-sm ${!canSelectEndDate ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
           </Typography>
        </div>
        <div className="flex items-center">
        <Typography>
          <input
            type="time"
            value={schedule.endTime}
            onChange={(e) => setScheduleEndTime(e.target.value)}
            disabled={!canSelectEndTime}
            className={`border border-gray-300 rounded-sm h-[30px] px-2 text-sm ${!canSelectEndTime ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
           </Typography>
        </div>
      </div>
      {scheduleErrors.date && (
        <Typography variant="caption" className="text-red-500 mt-1">
          {scheduleErrors.date}
        </Typography>
      )}
    </div>
  );
};
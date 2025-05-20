import React, { useEffect } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { TmpScheduleDate } from '../molecules/tmpScheduleDate';
import { useHomeStore } from '../../stores/useHomeStore';
import { useHome } from '../../hooks/useHome';
import { toast } from 'react-toastify';

interface RowTmpScheduleAddProps {
  temporaryScheduleId: number;
}

export const RowTmpScheduleAdd: React.FC<RowTmpScheduleAddProps> = ({ temporaryScheduleId }) => {
  const { 
    schedule, 
    scheduleErrors,
    setScheduleTitle,
    setScheduleStartDate,
    setScheduleEndDate,
    setScheduleDescription,
    setScheduleStartTime,
    setScheduleEndTime,
    validateSchedule,
    resetSchedule,
    setActiveRowId,
    validateAndAdjustDateTime 
  } = useHomeStore();
  
  const { useTemporarySchedule, useUpdateTemporarySchedule, useRegisterSchedule } = useHome();
  const { data: scheduleDetail, isLoading } = useTemporarySchedule(temporaryScheduleId);
  const updateScheduleMutation = useUpdateTemporarySchedule();
  const registerScheduleMutation = useRegisterSchedule();

  // API에서 데이터를 가져오면 스토어에 설정
  useEffect(() => {
    if (scheduleDetail) {
      setScheduleTitle(scheduleDetail.name);
      setScheduleDescription(scheduleDetail.description);
      
      // 시작 시간과 종료 시간 설정 (날짜와 시간 분리)
      if (scheduleDetail.startTime) {
        const startDateTime = new Date(scheduleDetail.startTime);
        const startDate = startDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
        const startTime = startDateTime.toTimeString().slice(0, 5); // HH:MM
        
        setScheduleStartDate(startDate);
        setScheduleStartTime(startTime);
      }
      
      if (scheduleDetail.endTime) {
        const endDateTime = new Date(scheduleDetail.endTime);
        const endDate = endDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
        const endTime = endDateTime.toTimeString().slice(0, 5); // HH:MM
        
        setScheduleEndDate(endDate);
        setScheduleEndTime(endTime);
      }
    }
  }, [scheduleDetail, setScheduleTitle, setScheduleDescription, setScheduleStartDate, setScheduleStartTime, setScheduleEndDate, setScheduleEndTime]);

  // 날짜와 시간을 ISO 형식으로 결합
  const combineDateTime = (date: string, time: string): string => {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    const dateObj = new Date(year, month - 1, day, hours, minutes);
    
    return dateObj.toISOString().replace('Z', '');
  };

  const handleApply = () => {
    validateAndAdjustDateTime();

    if (!validateSchedule()) {
      return; 
    }

    if (!schedule.startDate || !schedule.startTime || !schedule.endDate || !schedule.endTime) {
      toast.error('시작 시간과 종료 시간을 모두 설정해주세요.');
      return;
    }
    
    // API 요청 데이터 구성 - 로컬 시간대로 설정
    const scheduleData = {
      name: schedule.title,
      startTime: combineDateTime(schedule.startDate, schedule.startTime),
      endTime: combineDateTime(schedule.endDate, schedule.endTime),
      description: schedule.description,
      temporaryScheduleId: temporaryScheduleId
    };

    registerScheduleMutation.mutate(scheduleData, {
      onSuccess: () => {
        // 성공 시 현재 열린 행 닫기
        setActiveRowId(null);
        resetSchedule();
      }
    });
  };
  
  const handleTempSave = () => {
    validateAndAdjustDateTime();

    if (!validateSchedule()) {
      return; 
    }

    if (!schedule.startDate || !schedule.startTime || !schedule.endDate || !schedule.endTime) {
      toast.error('시작 시간과 종료 시간을 모두 설정해주세요.');
      return;
    }

    // API 요청 데이터 구성 - 로컬 시간대로 설정
    const scheduleData = {
      name: schedule.title,
      startTime: combineDateTime(schedule.startDate, schedule.startTime),
      endTime: combineDateTime(schedule.endDate, schedule.endTime),
      description: schedule.description,
      temporaryScheduleId: temporaryScheduleId
    };

    updateScheduleMutation.mutate(scheduleData);
  };

  if (isLoading) {
    return (
      <div className="mt-4 border-t border-gray-200 pt-4 bg-white rounded-md p-4">
        <Typography variant="titleMedium" className="font-medium mb-4">
          일정 로딩 중...
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 bg-white rounded-md p-4">
      <div className="mb-4">
        <Typography variant="titleMedium" className="font-medium mb-4">
          일정
        </Typography>
        
        <div className="mb-4">
          <Typography variant="titleSmall" className="text-gray-700 mb-1 flex items-center">
            일정명 <span className="text-red-500 ml-1">*</span>
          </Typography>
          <Input 
            value={schedule.title}
            onChange={(e) => setScheduleTitle(e.target.value)}
            placeholder="일정명을 입력하세요"
            size="medium"
            maxLength={50}
          />
          {scheduleErrors.title && (
            <Typography variant="caption" className="text-red-500 mt-1">
              {scheduleErrors.title}
            </Typography>
          )}
          <Typography variant="caption" className="text-gray-500 mt-1">
            {schedule.title.length}/50자
          </Typography>
        </div>
        
        <TmpScheduleDate />
        
        <div className="mb-4">
          <Typography variant="titleSmall" className="text-gray-700 mb-1">
            설명
          </Typography>
          <textarea
            value={schedule.description}
            onChange={(e) => setScheduleDescription(e.target.value)}
            placeholder="일정에 대한 설명을 입력하세요"
            className="border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary w-full p-3 text-sm h-24 resize-none"
            maxLength={100}
          />
          {scheduleErrors.description && (
            <Typography variant="caption" className="text-red-500 mt-1">
              {scheduleErrors.description}
            </Typography>
          )}
          <Typography variant="caption" className="text-gray-500 mt-1">
            {schedule.description.length}/100자
          </Typography>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleTempSave}
            disabled={updateScheduleMutation.isPending}
          >
            {updateScheduleMutation.isPending ? '저장 중...' : '임시저장'}
          </Button>
          <Button 
            variant="primary" 
            size="small" 
            onClick={handleApply}
            disabled={registerScheduleMutation.isPending}
          >
            {registerScheduleMutation.isPending ? '적용 중...' : '적용'}
          </Button>
        </div>
      </div>
    </div>
  );
};
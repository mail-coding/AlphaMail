import React, { useEffect } from 'react';
import { CalendarGrid } from '../organisms/calendarGrid';
import { ScheduleManagerGrid } from '../organisms/scheduleManagerGrid';
import { ScheduleDetailTemplate } from './scheduleDetailTemplate';
import { useModalStore, useModalKeyboard } from '@/shared/stores/useModalStore';
import { useScheduleStore } from '../../stores/useScheduleStore';
import { Schedule } from '../../types/schedule';
import { useCalendarSchedules } from '../../hooks/useCalendarSchedules';
import { useWeeklySchedules } from '../../hooks/useWeeklySchedules';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { useScheduleSearchStore } from '@/shared/stores/useSearchBar';
import { ScheduleSearchTemplate } from './scheduleSearchTemplate';
import { useLocation } from 'react-router-dom';
import { Typography } from '@/shared/components/atoms/Typography';
import { Spinner } from '@/shared/components/atoms/spinner';
import { useHolidays } from '../../hooks/useHolidays';

export const MainTemplate: React.FC = () => {
  const { isOpen, isAnimating, openModal, closeModal } = useModalStore();
  const { setSelectedSchedule, resetSchedule, setIsEdit } = useScheduleStore();
  const { isSearchMode, setIsSearchMode, setSearchKeyword } = useScheduleSearchStore();
  const location = useLocation();  
  useModalKeyboard();

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedWeekDate] = React.useState(new Date());

  // 페이지 이동 시 검색 상태 초기화
  useEffect(() => {
    setIsSearchMode(false);
    setSearchKeyword('');
  }, [location.pathname, setIsSearchMode, setSearchKeyword]);
  
  const { data: calendarSchedules, isLoading: isCalendarLoading, isError, error } = useCalendarSchedules(currentDate);
  const { data: weeklySchedules, isLoading: isWeeklyLoading } = useWeeklySchedules(selectedWeekDate);
  const { data: holidayMap = {}, isLoading: isHolidayLoading } = useHolidays(currentDate.getFullYear(), currentDate.getMonth() + 1);
  console.log('mainTemplate에서 useHolidays 호출됨', currentDate.getFullYear(), currentDate.getMonth() + 1);

  React.useEffect(() => {
    console.log('React Query 상태:', {
      calendarSchedules,
      weeklySchedules,
      isCalendarLoading,
      isWeeklyLoading,
      isError,
      error
    });
  }, [calendarSchedules, weeklySchedules, isCalendarLoading, isWeeklyLoading, isError, error]);

  const eventsMap = React.useMemo(() => {
    if (!calendarSchedules?.data) {
      return {};
    }

    const map: Record<string, Schedule[]> = {};
    const schedulePositions = new Map<string, number>(); // 일정의 위치(순서)를 저장

    // 모든 일정을 시작일 기준으로 정렬
    const sortedSchedules = [...calendarSchedules.data].sort((a, b) => {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    // 각 일정에 대해 시작일부터 종료일까지의 모든 날짜에 일정 추가
    sortedSchedules.forEach((schedule) => {
      let currentDate = startOfDay(new Date(schedule.start_time));
      const endDate = startOfDay(new Date(schedule.end_time));

      // 사용 가능한 위치 찾기
      let position = 0;
      while (true) {
        let isPositionAvailable = true;
        for (let date = currentDate; date <= endDate; date = addDays(date, 1)) {
          const dateKey = format(date, 'yyyy-MM-dd');
          if (map[dateKey] && map[dateKey][position]) {
            isPositionAvailable = false;
            break;
          }
        }
        if (isPositionAvailable) break;
        position++;
      }

      schedulePositions.set(schedule.id, position);

      while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        if (!map[dateKey]) {
          map[dateKey] = [];
        }

        // 해당 일정의 위치에 맞게 빈 슬롯 채우기
        while (map[dateKey].length <= position) {
          map[dateKey].push(null as unknown as Schedule);
        }
        map[dateKey][position] = schedule;

        currentDate = addDays(currentDate, 1);
      }
    });

    return map;
  }, [calendarSchedules]);

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(new Date(year, month));
  };

  const handleEventClick = (event: Schedule) => {
    setSelectedSchedule(event);
    setIsEdit(true);
    openModal();
  };

  const handleAddSchedule = () => {
    resetSchedule();
    setTimeout(() => {
      openModal();
    }, 0);
  };

  if (isCalendarLoading || isWeeklyLoading || isHolidayLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  // 검색 모드일 때는 검색 결과 템플릿을 표시
  if (isSearchMode) {
    return <ScheduleSearchTemplate />;
  }
  
  return (
    <div className="relative p-4">
      <div className="flex gap-4">
        {/* 좌측: 캘린더 */}
        <div className="flex-1">
          <CalendarGrid 
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            eventsMap={eventsMap}
            onEventClick={handleEventClick}
            onMonthChange={handleMonthChange}
            holidayMap={holidayMap}
          />
        </div>
        {/* 우측: 일정 추가 버튼 + ScheduleManagerGrid */}
        <div className="w-80 flex flex-col">
          <div className="mb-4">
            <button
              onClick={handleAddSchedule}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-gray-100 transition"
              type="button"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </span>
              <Typography variant="titleMedium">새로운 일정 등록</Typography>
            </button>
          </div>
          <div className="flex-1">
            <ScheduleManagerGrid
              schedules={weeklySchedules?.data || []}
            />
          </div>
        </div>
      </div>
      <ScheduleDetailTemplate
        onClose={closeModal}
        isOpen={isOpen}
        isAnimating={isAnimating}
      />
    </div>
  );
};

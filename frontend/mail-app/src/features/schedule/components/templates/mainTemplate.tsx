import React, { useEffect } from 'react';
import { CalendarGrid } from '../organisms/calendarGrid';
import { ScheduleManagerGrid } from '../organisms/scheduleManagerGrid';
import { ScheduleDetailTemplate } from './scheduleDetailTemplate';
import { useModalStore, useModalKeyboard } from '@/shared/stores/useModalStore';
import { useScheduleStore } from '../../stores/useScheduleStore';
import { Schedule } from '../../types/schedule';
import { useCalendarSchedules } from '../../hooks/useCalendarSchedules';
import { useWeeklySchedules } from '../../hooks/useWeeklySchedules';
import { addDays, format, startOfDay, differenceInDays } from 'date-fns';
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
  // const dateSchedules: Record<string, Schedule[]> = {};
  // const result: Record<string, { filteredEvents: Schedule[] }> = {};
  // const usedPositions: Record<string, Set<number>> = {};
  
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

// 이벤트 정보를 위한 인터페이스 정의
interface EventInfo {
  schedule: Schedule;
  startDate: Date;
  endDate: Date;
  startTime: number;
  durationDays: number;
  position: number;
}


const eventsMap = React.useMemo(() => {
  if (!calendarSchedules?.data) {
    return {};
  }

  console.log("다중일 일정 충돌 감지 및 별도 행 배치 방식 적용");
  
  // 일정 데이터 복사
  const schedules = [...calendarSchedules.data];
  
  // 결과 맵 초기화
  const result: Record<string, any> = {};
  
  // 날짜별 일정 목록 (모달용)
  const dateSchedules: Record<string, Schedule[]> = {};
  
  // 다중일 일정과 단일일 일정 분리
  const multiDayEvents: EventInfo[] = [];
  const singleDayEvents: EventInfo[] = [];
  
  // 1. 일정 분류 및 날짜 범위 계산
  schedules.forEach((schedule: Schedule) => {
    const startDate = startOfDay(new Date(schedule.start_time));
    const endDate = startOfDay(new Date(schedule.end_time));
    const durationDays = differenceInDays(endDate, startDate) + 1;
    const isMultiDay = durationDays > 1;
    
    const eventInfo: EventInfo = {
      schedule,
      startDate,
      endDate,
      startTime: new Date(schedule.start_time).getTime(),
      durationDays,
      position: -1 // 아직 배치되지 않음
    };
    
    // 다중일/단일일 분류
    if (isMultiDay) {
      multiDayEvents.push(eventInfo);
    } else {
      singleDayEvents.push(eventInfo);
    }
    
    // 이 일정이 걸쳐있는 모든 날짜에 대해 결과 맵 초기화
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      
    if (!Array.isArray(result[dateKey])) {
        result[dateKey] = [];
        result[dateKey].filteredEvents = []; // <-- 여기에서 filteredEvents 속성을 추가
      }
      
      
      // 날짜별 일정 목록 초기화 (모달용)
      if (!dateSchedules[dateKey]) {
        dateSchedules[dateKey] = [];
      }
      
      // 날짜별 일정 목록에 추가 (중복 방지)
      if (!dateSchedules[dateKey].some((s: Schedule) => s.id === schedule.id)) {
        dateSchedules[dateKey].push(schedule);
      }
      
      currentDate = addDays(currentDate, 1);
    }
  });
  
  // 2. 다중일 일정 시작 시간순 정렬
  multiDayEvents.sort((a: EventInfo, b: EventInfo) => a.startTime - b.startTime);
  
  // 3. 충돌 감지 알고리즘으로 다중일 일정 배치
  // (이 부분이 핵심)
  const usedPositions: Record<string, Set<number>> = {}; // dateKey -> 사용된 포지션 집합
  const eventPositions: Record<string, number> = {}; // 일정 ID -> 포지션
  
  // 포지션 확인 및 배치 함수
  const placeEvent = (event: EventInfo) => {
    let position = 0;
    let placed = false;
    
    // 일정의 시작부터 끝까지 모든 날짜 범위에 대해
    let currentDate = new Date(event.startDate);
    const dateRangePositions = new Set<number>(); // 이 일정이 걸친 모든 날짜의 사용 중인 포지션
    
    // 먼저 각 날짜별로 사용 중인 포지션 수집
    while (currentDate <= event.endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      if (!usedPositions[dateKey]) {
        usedPositions[dateKey] = new Set<number>();
      }
      
      // 이 날짜에 사용된 모든 포지션을 저장
      usedPositions[dateKey].forEach((pos: number) => dateRangePositions.add(pos));
      
      currentDate = addDays(currentDate, 1);
    }
    
    // 사용 가능한 가장 낮은 포지션 찾기
    while (!placed) {
      if (!dateRangePositions.has(position)) {
        // 가능한 포지션 찾음
        placed = true;
        
        // 모든 날짜에 이 포지션 사용 표시
        currentDate = new Date(event.startDate);
        while (currentDate <= event.endDate) {
          const dateKey = format(currentDate, 'yyyy-MM-dd');
          usedPositions[dateKey].add(position);
          currentDate = addDays(currentDate, 1);
        }
        
        // 포지션 저장
        event.position = position;
        eventPositions[event.schedule.id] = position;
      } else {
        // 다음 포지션 확인
        position++;
      }
    }
    
    // 일정 배치
    currentDate = new Date(event.startDate);
    while (currentDate <= event.endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      
      // 배열 확장
      while (result[dateKey].length <= position) {
        result[dateKey].push(null);
      }
      
      // 일정 배치
      result[dateKey][position] = event.schedule;
      
      currentDate = addDays(currentDate, 1);
    }
  };
  
  // 다중일 일정 배치 (시작 시간순으로 정렬된 상태)
  multiDayEvents.forEach(placeEvent);
  
  // 4. 단일일 일정 시작 시간순 정렬 및 배치
  singleDayEvents.sort((a: EventInfo, b: EventInfo) => a.startTime - b.startTime);
  
  // 단일일 일정 배치 (다중일 일정 배치 후)
  singleDayEvents.forEach((event: EventInfo) => {
    const dateKey = format(event.startDate, 'yyyy-MM-dd');
    
    if (!usedPositions[dateKey]) {
      usedPositions[dateKey] = new Set<number>();
    }
    
    // 사용 가능한 가장 낮은 포지션 찾기
    let position = 0;
    while (usedPositions[dateKey].has(position)) {
      position++;
    }
    
    // 포지션 사용 표시
    usedPositions[dateKey].add(position);
    
    // 포지션 저장
    event.position = position;
    eventPositions[event.schedule.id] = position;
    
    // 배열 확장
    while (result[dateKey].length <= position) {
      result[dateKey].push(null);
    }
    
    // 일정 배치
    result[dateKey][position] = event.schedule;
  });
  
  // 5. 각 날짜별 필터링된 일정 목록 추가 (모달용)
  for (const dateKey in dateSchedules) {
    if (!result[dateKey]) {
      result[dateKey] = [];
    }
    
    // 각 날짜의 일정 중 고유 일정만 필터링
    const allEvents = result[dateKey].filter((event: Schedule | null) => event !== null) as Schedule[];
    const uniqueEvents = [...new Map(allEvents.map((event: Schedule) => [event.id, event])).values()];
    
    // 필터링된 일정 목록 설정
    result[dateKey].filteredEvents = uniqueEvents;
  }
  
  console.log("일정 ID별 포지션:", eventPositions);
  
  return result;
}, [calendarSchedules?.data]);

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
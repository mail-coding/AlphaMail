import React, { useState, useEffect } from 'react';
import { Schedule } from '@/features/schedule/types/schedule';
import { format, isSameDay, startOfDay, isMonday } from 'date-fns';
import { ScheduleDayModal } from './ScheduleDayModal';

interface CalendarDayCellProps {
  date: Date;
  events: any; // (Schedule | null)[] & { filteredEvents?: Schedule[] };
  isToday: boolean;
  isCurrentMonth: boolean;
  cellHeightClass?: string;
  onEventClick?: (event: Schedule) => void;
  holidayMap?: Record<string, string>;
  
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  events,
  isToday,
  isCurrentMonth,
  onEventClick,
  holidayMap = {},
  
}) => {
  // 각 셀에 표시할 최대 일정 수
  const MAX_VISIBLE_EVENTS = 3;

  const [showModal, setShowModal] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  // 날짜 색상 처리
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const isHoliday = !!holidayMap[dateKey];
  const holidayName = holidayMap[dateKey];
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  let dayColor = '';
  if (isHoliday || isSunday) {
    dayColor = 'text-red-500';
  } else if (isSaturday) {
    dayColor = 'text-blue-500';
  }

  const getEventStyle = (event: Schedule) => {
    if (!event) return 'text-xs text-black cursor-pointer p-1 overflow-hidden flex items-center';

    const currentDate = startOfDay(date);
    const startDate = startOfDay(new Date(event.start_time));
    const endDate = startOfDay(new Date(event.end_time));

    const isStart = isSameDay(currentDate, startDate);
    const isEnd = isSameDay(currentDate, endDate);
    const isSingleDay = isStart && isEnd;
    const isMultiDay = !isSingleDay;

    const isCompleted = event.is_done;
    // const duration = differenceInDays(endDate, startDate) + 1;

    // 여러 날짜에 걸친 일정만 배경색 적용
    if (isMultiDay) {
      // 완료된 일정은 회색 바로 표시
      const baseStyle = isCompleted 
        ? 'text-xs text-gray-500 bg-gray-200 cursor-pointer overflow-hidden'
        : 'text-xs text-white bg-[#3E99C6] cursor-pointer overflow-hidden';
      
      // 시작일과 종료일에 둥근 모서리 적용
      if (isStart) {
        return `${baseStyle} p-1 rounded-l-md border-r-0`; 
      } else if (isEnd) {
        return `${baseStyle} p-1 rounded-r-md border-l-0`; 
      } else {
        return `${baseStyle} p-1 border-x-0`; 
      }
    }
    
    // 단일 날짜 일정은 배경색 없이 텍스트만
    return `text-xs ${isCompleted ? 'text-gray-400' : 'text-black'} cursor-pointer p-1 overflow-hidden flex items-center`;
  };

  const getDotColor = (event: Schedule) => {
    if (!event) return '#3E99C6'; // 기본 색상
    return event.is_done ? '#9CA3AF' : '#3E99C6'; // 완료된 일정은 회색, 미완료는 파란색
  };

  // 일정명을 표시해야 하는지 결정하는 함수
  const shouldShowEventName = (event: Schedule) => {
    if (!event) return false;
    
    const currentDate = startOfDay(date);
    const startDate = startOfDay(new Date(event.start_time));
    
    // 1. 일정 시작일인 경우 항상 표시
    if (isSameDay(currentDate, startDate)) return true;
    
    // 2. 주의 첫날(월요일)에 표시
    if (isMonday(currentDate)) return true;
    
    return false;
  };

  // 긴 공휴일 이름 약어로 표시
  const formatHolidayName = (name: string) => {
    if (name.includes('공휴일')) {
      if (name.length > 8) {
        return name.substring(0, 6) + '...';
      }
    }
    return name;
  };

  // 연속된 일정은 위치가 유지되도록 하고, 모달에는 모든 일정이 표시되도록 수정
  const eventsArray = Array.isArray(events) ? events : [];
  
  // null이 아닌 실제 일정만 필터링
  const nonNullEvents = eventsArray.filter(event => event !== null) as Schedule[];
  
  // 중복을 제거한 고유 일정 목록
  const uniqueEvents = [...new Map(nonNullEvents.map(event => [event.id, event])).values()];
  
  // 모달에 표시할 필터링된 일정 목록
  const filteredEvents = events.filteredEvents || uniqueEvents;
  
  // 정확히 MAX_VISIBLE_EVENTS개까지만 보여주기
  const visibleEvents = nonNullEvents.slice(0, MAX_VISIBLE_EVENTS);
  
  // 고유 일정 개수와 표시 일정 개수 비교하여 더보기 버튼 표시 여부 결정
  const realEventCount = filteredEvents.length;
  const hiddenEventsCount = Math.max(0, realEventCount - visibleEvents.length);
  
  // 디버깅용 로그
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (nonNullEvents.length > 0 || filteredEvents.length > 0) {
        console.log(`${dateStr} 일정 정보:`, {
          전체: eventsArray.length,
          실제: nonNullEvents.length,
          고유: uniqueEvents.length,
          필터링됨: filteredEvents.length,
          표시: visibleEvents.length,
          숨김: hiddenEventsCount
        });
      }
    }
  }, [date, eventsArray.length, nonNullEvents.length, uniqueEvents.length, filteredEvents.length, visibleEvents.length, hiddenEventsCount]);

  return (
    <>
      <div
        className={`min-h-[120px] border-b border-r border-gray-300 bg-white ${
          !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
        } ${isToday ? 'bg-blue-50' : ''}`}
      >
        <div className={`inline-flex items-center font-medium p-2 ${isToday ? 'text-blue-600 font-bold' : ''} ${!isCurrentMonth ? 'text-gray-400' : dayColor}`}>
          <span>{date.getDate()}</span>
          {holidayName && (
            <span className={`ml-1 text-xs align-middle truncate max-w-[60px] ${!isCurrentMonth ? 'text-gray-400' : 'text-red-500'}`} title={holidayName}>
              {formatHolidayName(holidayName)}
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          {/* 표시할 일정만 매핑 (최대 MAX_VISIBLE_EVENTS개) */}
          {visibleEvents.map((event, index) => {
            const isStart = isSameDay(date, new Date(event.start_time));
            const isEnd = isSameDay(date, new Date(event.end_time));
            const isSingleDay = isStart && isEnd;
            const isMultiDay = !isSingleDay;
            const showEventName = shouldShowEventName(event);
            
            return (
              <div
                key={`${event.id}-${index}`}
                className={getEventStyle(event) + " w-full h-[24px]"}
                onClick={() => event && onEventClick?.(event)}
              >
                {(isStart || showEventName) ? (
                  <div className="flex items-center w-full min-w-0">
                    {isSingleDay ? (
                      <span 
                        className="inline-block w-2 h-2 rounded-full mr-1 flex-shrink-0" 
                        style={{ background: getDotColor(event) }} 
                      />
                    ) : null}
                    <span className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                      {isStart ? `${formatTime(event.start_time.toISOString())} ${event.name}` : event.name}
                    </span>
                  </div>
                ) : isMultiDay ? (
                  <div className="w-full h-full">&nbsp;</div>
                ) : (
                  <div className="invisible">placeholder</div>
                )}
              </div>
            );
          })}
          
          {/* 더보기 버튼 - 숨겨진 일정이 있을 때만 표시 */}
          {hiddenEventsCount > 0 && (
            <div 
              className="text-xs text-gray-500 p-1 cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center"
              onClick={() => setShowModal(true)}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {hiddenEventsCount}개 더보기
            </div>
          )}
        </div>
      </div>

      <ScheduleDayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        date={date}
        events={filteredEvents}
        onEventClick={onEventClick}
      />
    </>
  );
};
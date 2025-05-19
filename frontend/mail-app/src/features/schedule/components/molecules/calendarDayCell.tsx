import React from 'react';
import { Schedule } from '@/features/schedule/types/schedule';
import { format, isSameDay, startOfDay } from 'date-fns';

interface CalendarDayCellProps {
  date: Date;
  events: (Schedule | null)[];
  isToday: boolean;
  isCurrentMonth: boolean;
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

    const isCompleted = event.is_done;

    // 여러 날짜에 걸친 일정만 배경색 적용
    if (!isSingleDay) {
      // 완료된 일정은 회색 바로 표시
      return isCompleted 
        ? 'text-xs text-gray-500 bg-gray-200 cursor-pointer p-1 overflow-hidden'
        : 'text-xs text-white bg-[#3E99C6] cursor-pointer p-1 overflow-hidden';
    }
    // 단일 날짜 일정은 배경색 없이 텍스트만
    return `text-xs ${isCompleted ? 'text-gray-400' : 'text-black'} cursor-pointer p-1 overflow-hidden flex items-center`;
  
  };

  const getTextStyle = () => {
    return '';
  };
  
  const getDotColor = (event: Schedule) => {
    if (!event) return '#3E99C6'; // 기본 색상
    return event.is_done ? '#9CA3AF' : '#3E99C6'; // 완료된 일정은 회색, 미완료는 파란색
  };

  return (
    <div
      className={`min-h-[100px] border-b border-gray-300 bg-white ${
        !isCurrentMonth ? 'text-gray-400' : ''
      } ${isToday ? 'bg-blue-100' : ''}`}
    >
      <div className={`inline-flex items-center font-medium p-2 ${isToday ? 'text-blue-600 font-bold' : ''} ${!isCurrentMonth ? 'text-gray-400' : dayColor}`}>
        <span>{date.getDate()}</span>
        {holidayName && (
          <span className={`ml-1 text-xs align-middle ${!isCurrentMonth ? 'text-gray-400' : 'text-red-500'}`}>{holidayName}</span>
        )}
      </div>
      <div className="space-y-0.5">
        {events.map((event, index) => {
          const baseEvent = events[index] || {} as Schedule;
          const eventClass = getEventStyle(baseEvent) + " w-full flex items-center p-1 overflow-hidden";
          if (!event) {
            return (
              <div
                key={index}
                className={eventClass + " h-[24px]"}
                style={{ opacity: 0 }}
              >
                <span className="flex-1 min-w-0">&nbsp;</span>
              </div>
            );
          }

          const isStart = isSameDay(date, new Date(event.start_time));
          const isEnd = isSameDay(date, new Date(event.end_time));
          const isSingleDay = isStart && isEnd;

          return (
            <div
              key={`${event.id}-${index}`}
              className={getEventStyle(event) + " w-full h-[24px]"}
              onClick={() => event && onEventClick?.(event)}
            >
              {isStart ? (
                <div className="flex items-center w-full min-w-0">
                  {isSingleDay ? (
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-1 flex-shrink-0" 
                      style={{ background: getDotColor(event) }} 
                    />
                  ) : null}
                  <span className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis ${getTextStyle()}`}>
                    {formatTime(event.start_time.toISOString())} {event.name}
                  </span>
                </div>
              ) : (
                <div className="invisible">placeholder</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

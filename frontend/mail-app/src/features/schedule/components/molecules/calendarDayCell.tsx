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
    if (!event) return '';

    const currentDate = startOfDay(date);
    const startDate = startOfDay(new Date(event.start_time));
    const endDate = startOfDay(new Date(event.end_time));

    const isStart = isSameDay(currentDate, startDate);
    const isEnd = isSameDay(currentDate, endDate);
    const isSingleDay = isStart && isEnd;

    // 여러 날짜에 걸친 일정만 배경색 적용
    if (!isSingleDay) {
      return 'text-xs text-white cursor-pointer p-1 overflow-hidden bg-[#3E99C6]';
    }
    // 단일 날짜 일정은 배경색 없이 텍스트만
    return 'text-xs text-black cursor-pointer p-1 overflow-hidden flex items-center';
  };

  return (
    <div
      className={`min-h-[100px] ${
        !isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'bg-white'
      } ${isToday ? 'bg-blue-100' : ''}`}
    >
      <div className={`flex justify-between items-center font-medium p-2 ${isToday ? 'text-blue-600 font-bold' : ''} ${dayColor}`}>
        {holidayName ? (
          <span className="text-xs align-middle text-red-500">{holidayName}</span>
        ) : <span></span>}
        <span>{date.getDate()}</span>
      </div>
      <div className="space-y-0.5">
        {events.map((event, index) => {
          if (!event) return <div key={index} className="h-[28px]" />;

          const isStart = isSameDay(date, new Date(event.start_time));
          const isEnd = isSameDay(date, new Date(event.end_time));
          const isSingleDay = isStart && isEnd;

          return (
            <div
              key={`${event.id}-${index}`}
              className={getEventStyle(event)}
              onClick={() => event && onEventClick?.(event)}
            >
              {isStart ? (
                <div className="truncate flex items-center">
                  {isSingleDay ? (
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#3E99C6' }} />
                  ) : null}
                  {formatTime(event.start_time.toISOString())} {event.name}
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

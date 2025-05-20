import React, { useMemo } from 'react';
import { CalendarDayCell } from '@/features/schedule/components/molecules/calendarDayCell';
import { Schedule } from '@/features/schedule/types/schedule';
import { Typography } from '@/shared/components/atoms/Typography';

interface CalendarGridProps {
  year: number;
  month: number; // 0 = 1월, 11 = 12월
  eventsMap?: Record<string, any>; // "YYYY-MM-DD" 형태로 매칭
  onMonthChange: (year: number, month: number) => void;
  onEventClick?: (event: Schedule) => void;
  holidayMap?: Record<string, string>;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  year, 
  month, 
  eventsMap = {}, 
  onMonthChange,
  onEventClick,
  holidayMap = {},
}) => {
  // 월의 날짜 및 달력 데이터 계산
  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: Date[] = [];

    // 앞쪽 지난달 채우기
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, i - firstDayOfWeek + 1);
      dates.push(prevMonthDate);
    }

    // 이번 달 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }

    // 뒷쪽 다음달 채우기 (최대 6주 - 42일로 제한)
    const totalCells = 42; // 6주 x 7일
    while (dates.length < totalCells) {
      const nextMonthDate = new Date(year, month + 1, dates.length - (firstDayOfWeek + daysInMonth) + 1);
      dates.push(nextMonthDate);
    }

    // 날짜 배열을 주 단위로 분할
    const weeks: Date[][] = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }

    // 마지막 주에 다음 달 날짜만 있는 경우를 확인
    const lastWeek = weeks[weeks.length - 1];
    const isLastWeekAllNextMonth = lastWeek.every(date => date.getMonth() !== month);

    // 마지막 주가 모두 다음 달이면 제거 (필요한 경우만 6주 표시)
    if (isLastWeekAllNextMonth && weeks.length > 5) {
      weeks.pop();
    }

    return { weeks, daysInMonth, firstDayOfWeek };
  }, [year, month]);

  // 오늘 날짜
  const today = new Date();
  const todayString = today.toDateString();

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  // 고유한 키 생성 - 강제 리렌더링 보장
  const gridKey = `calendar-${year}-${month}-${Object.keys(eventsMap).length}-${Date.now()}`;

  // 주 수에 따른 캘린더 셀 높이 계산
  const weekCount = calendarData.weeks.length;
  const cellHeight = weekCount === 6 ? 'min-h-[120px]' : 'min-h-[140px]';

  return (
    <div className="w-full bg-white rounded-lg shadow-md" key={gridKey}>
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-center py-4 px-2 gap-2 bg-white border-b border-gray-200">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <Typography variant="titleMedium">
          <div className="flex items-center justify-center w-[140px] truncate">
            {year}년 {month + 1}월
          </div>
        </Typography>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => {
            const today = new Date();
            onMonthChange(today.getFullYear(), today.getMonth());
          }}
          className="ml-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
        >
          오늘
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day, index) => (
          <Typography 
            key={day} 
            variant="titleSmall" 
            className={`
              ${index === 0 ? 'text-red-500' : ''} 
              ${index === 6 ? 'text-blue-500' : ''}
            `}
          >
            {day}
          </Typography>
        ))}
      </div>

      {/* 날짜 셀 - 주 단위로 렌더링 */}
      <div className="bg-white border-t border-l border-gray-200">
        {calendarData.weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}-${gridKey}`} className="grid grid-cols-7">
            {week.map((date, dayIndex) => {
              const dateString = date.toDateString();
              const isToday = dateString === todayString;
              const isCurrentMonth = date.getMonth() === month;
              
              // 로컬 날짜를 YYYY-MM-DD 형식으로 변환
              const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              const events = eventsMap[dateKey] || [];
              
              return (
                <CalendarDayCell
                  key={`cell-${dateKey}-${weekIndex}-${dayIndex}`}
                  date={date}
                  events={events}
                  isToday={isToday}
                  isCurrentMonth={isCurrentMonth}
                  onEventClick={onEventClick}
                  holidayMap={holidayMap}
                  /* 주 수에 따라 셀 높이 조정 */
                  cellHeightClass={cellHeight}
                />
              );
            })}
          </div>
        ))}
      </div>
      
    </div>
  );
};
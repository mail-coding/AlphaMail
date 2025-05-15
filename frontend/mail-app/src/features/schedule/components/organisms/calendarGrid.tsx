import React from 'react';
import { CalendarDayCell } from '@/features/schedule/components/molecules/calendarDayCell';
import { Schedule } from '@/features/schedule/types/schedule';

interface CalendarGridProps {
  year: number;
  month: number; // 0 = 1월, 11 = 12월
  eventsMap?: Record<string, Schedule[]>; // "YYYY-MM-DD" 형태로 매칭
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
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 1. 날짜 배열 만들기
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

  // 뒷쪽 다음달 채우기
  while (dates.length % 7 !== 0) {
    const nextMonthDate = new Date(year, month + 1, dates.length - (firstDayOfWeek + daysInMonth) + 1);
    dates.push(nextMonthDate);
  }

  // 2. 오늘 날짜
  const today = new Date();
  const todayString = today.toDateString();

  // 3. 요일 헤더
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

  return (
    <div className="w-full">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">
            {year}년 {month + 1}월
          </div>
          <button
            onClick={() => {
              const today = new Date();
              onMonthChange(today.getFullYear(), today.getMonth());
            }}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          >
            오늘
          </button>
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center font-bold mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7">
        {dates.map((date, index) => {
          const dateString = date.toDateString();
          const isToday = dateString === todayString;
          const isCurrentMonth = date.getMonth() === month;
          
          // 로컬 날짜를 YYYY-MM-DD 형식으로 변환
          const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          const events = eventsMap[dateKey] || [];
          
          return (
            <CalendarDayCell
              key={index}
              date={date}
              events={events}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              onEventClick={onEventClick}
              holidayMap={holidayMap}
            />
          );
        })}
      </div>
    </div>
  );
};
// // 헬퍼 함수: "YYYY-MM-DD" 포맷
// function formatDateKey(date: Date) {
//   return date.toISOString().split('T')[0]; // 예: "2025-04-28"
// }


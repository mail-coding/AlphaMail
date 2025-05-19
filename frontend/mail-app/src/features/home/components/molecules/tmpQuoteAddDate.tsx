import React, { useEffect, useState } from 'react';
import { Input } from '@/shared/components/atoms/input';
import { Typography } from '@/shared/components/atoms/Typography';
import { useTmpQuoteStore } from '../../stores/useTmpQuoteStore';

interface TmpQuoteAddDateProps {
  initialDate?: string;
}

export const TmpQuoteAddDate: React.FC<TmpQuoteAddDateProps> = ({ initialDate }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { deliveryDate, setDeliveryDate } = useTmpQuoteStore();
  
  useEffect(() => {
    if (initialDate) {
      setDeliveryDate(initialDate);
    }
  }, [initialDate, setDeliveryDate]);

  // 오늘 날짜 계산 (YYYY-MM-DD 형식)
  const today = new Date().toISOString().split('T')[0];

  const handleClick = () => {
    setIsCalendarOpen(true);
  };

  const handleClose = () => {
    setIsCalendarOpen(false);
  };

  const handleDateSelect = (date: string) => {
    setDeliveryDate(date);
    setIsCalendarOpen(false);
  };

  return (
    <div className="w-full">
      <Input
        type="text"
        value={deliveryDate}
        onClick={handleClick}
        readOnly
        className="cursor-pointer w-full !h-8 !text-sm !rounded-none"
      />
      
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[350px]">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="titleMedium">납기일자 선택</Typography>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="date"
                min={today}
                className="w-full border border-gray-300 rounded-sm p-2"
                onChange={(e) => handleDateSelect(e.target.value)}
              />
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={handleClose}
              >
                취소
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleDateSelect(deliveryDate)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
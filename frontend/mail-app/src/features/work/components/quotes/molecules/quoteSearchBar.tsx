import React, { useRef } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface QuoteSearchBarProps {
  onSearch: (params: QuoteSearchParams) => void;
}

export interface QuoteSearchParams {
  keyword: string;
  receiverCompany: string;
  sender: string;
  startDate: string;
  endDate: string;
  product: string;
}

export const QuoteSearchBar: React.FC<QuoteSearchBarProps> = ({ onSearch }) => {
  const clientRef = useRef<HTMLInputElement>(null);
  const quoteNoRef = useRef<HTMLInputElement>(null);
  const managerRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = {
      keyword: clientRef.current?.value || '',
      receiverCompany: quoteNoRef.current?.value || '',
      sender: managerRef.current?.value || '',
      startDate: startDateRef.current?.value || '',
      endDate: endDateRef.current?.value || '',
      product: itemRef.current?.value || '',
    };
    onSearch(params);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white p-4 border border-gray-200 rounded mb-4"
    >
      {/* 1st row: 거래처, 견적번호, 담당자 */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 min-w-[56px] text-right">거래처</label>
          <input
            ref={clientRef}
            className="w-[240px] h-[30px] px-2 bg-white text-base placeholder-gray-400 border border-gray-300 focus:outline-none pr-8 rounded-none"
            placeholder="거래처명/사업자등록번호"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 min-w-[56px] text-right">견적번호</label>
          <input
            ref={quoteNoRef}
            className="w-[140px] h-[30px] px-2 bg-white text-base placeholder-gray-400 border border-gray-300 focus:outline-none pr-8 rounded-none"
            placeholder="견적번호"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 min-w-[56px] text-right">담당자</label>
          <input
            ref={managerRef}
            className="w-[140px] h-[30px] px-2 bg-white text-base placeholder-gray-400 border border-gray-300 focus:outline-none pr-8 rounded-none"
            placeholder="담당자"
          />
        </div>
      </div>
      {/* 2nd row: 견적일자, 품목, 검색버튼 */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center mt-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 min-w-[56px] text-right">견적일자</label>
          <input
            ref={startDateRef}
            type="date"
            className="w-[140px] h-[30px] px-2 bg-white text-base border border-gray-300 focus:outline-none rounded-none"
          />
          <span className="mx-1 text-gray-400">-</span>
          <input
            ref={endDateRef}
            type="date"
            className="w-[140px] h-[30px] px-2 bg-white text-base border border-gray-300 focus:outline-none rounded-none"
          />
        </div>
        <div className="flex items-center gap-2 relative">
          <label className="text-sm text-gray-600 min-w-[40px] text-right">품목</label>
          <input
            ref={itemRef}
            className="w-[140px] h-[30px] px-2 bg-white text-base placeholder-gray-400 border border-gray-300 focus:outline-none pr-8 rounded-none"
            placeholder="품목"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <button
          type="submit"
          className="w-[110px] h-[40px] bg-[#3E99C6] text-white rounded-lg font-semibold flex items-center justify-center gap-2 ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <Typography variant="titleSmall" className="text-white">검색</Typography>
        </button>
      </div>
    </form>
  );
};

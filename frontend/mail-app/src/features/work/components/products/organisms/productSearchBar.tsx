import React, { useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface ProductSearchBarProps {
  keyword: string;
  onSearch: (keyword: string) => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  keyword,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState(keyword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-0 border-none bg-transparent mb-4">
      <Typography variant="titleSmall" className="mr-2">품목</Typography>
      <div className="flex items-center border border-gray-300 bg-white relative" style={{ borderRadius: 0 }}>
        <input
          type="text"
          className="w-[240px] h-[30px] px-2 bg-white text-base placeholder-gray-400 focus:outline-none pr-8"
          placeholder="품목명"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
        className="w-[110px] h-[40px] bg-[#3E99C6] text-white rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <Typography variant="titleSmall" className="text-white">검색</Typography>
      </button>
    </form>
  );
}; 
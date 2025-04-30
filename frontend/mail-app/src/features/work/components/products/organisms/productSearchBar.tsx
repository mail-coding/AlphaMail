import React from 'react';

interface ProductSearchBarProps {
  keyword: string;
  onSearch: (keyword: string) => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  keyword,
  onSearch,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        value={keyword}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="품목명"
        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => onSearch(keyword)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        검색
      </button>
    </div>
  );
}; 
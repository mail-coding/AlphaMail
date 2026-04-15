import React from 'react';
import { PaginationButton } from '../molecules/paginationButton';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  
  const renderPageButtons = () => {
    const buttons = [];
    
    // 처음 페이지로 이동
    buttons.push(
      <PaginationButton
        key="first"
        page="<<"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
    );
    
    // 이전 페이지로 이동
    buttons.push(
      <PaginationButton
        key="prev"
        page="<"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    
    // 페이지 번호 버튼
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          page={i}
          isActive={i === currentPage}
          onClick={() => onPageChange(i)}
        />
      );
    }
    
    // 다음 페이지로 이동
    buttons.push(
      <PaginationButton
        key="next"
        page=">"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    
    // 마지막 페이지로 이동
    buttons.push(
      <PaginationButton
        key="last"
        page=">>"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    );
    
    return buttons;
  };

  return (
    <div className="flex justify-center items-center py-4 gap-1">
      {renderPageButtons()}
    </div>
  );
};
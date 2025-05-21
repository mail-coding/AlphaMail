import React from 'react';
import { CheckboxItem } from '../molecules/checkboxItem';
import { ButtonGroup } from '../molecules/buttonGroup';
import { useMailStore } from '../../stores/useMailStore';
import { FaArrowLeft } from 'react-icons/fa';

interface MailListHeaderProps {
  allSelected: boolean;
  onSelectAll: (selected: boolean) => void;
  onReply?: () => void;
  onMoveToTrash?: () => void;
  onRestore?: () => void;
  onEmptyTrash?: () => void;
  selectedCount: number;
  folderType?: 'inbox' | 'sent' | 'trash';
}

export const MailListHeader: React.FC<MailListHeaderProps> = ({
  allSelected,
  onSelectAll,
  onReply,
  onMoveToTrash,
  onRestore,
  onEmptyTrash,
  selectedCount,
  folderType = 'inbox',
}) => {
  const { searchKeyword, clearSearchKeyword } = useMailStore();

  // 검색 초기화 핸들러
  const handleClearSearch = () => {
    clearSearchKeyword();
  };

  // 폴더 타입에 따라 다른 버튼 구성
  const getButtons = () => {
    const buttons = [];
    
    if (folderType === 'inbox') {
      if (onReply) buttons.push({
        label: '답장',
        onClick: onReply,
        variant: 'text' as const,
        disabled: selectedCount !== 1
      });
      
      if (onMoveToTrash) buttons.push({
        label: '삭제',
        onClick: onMoveToTrash,
        variant: 'text' as const,
        disabled: selectedCount === 0
      });
    } else if (folderType === 'sent') {
      if (onMoveToTrash) buttons.push({
        label: '삭제',
        onClick: onMoveToTrash,
        variant: 'text' as const,
        disabled: selectedCount === 0
      });
    } else if (folderType === 'trash') {
      if (onRestore) buttons.push({
        label: '복원',
        onClick: onRestore,
        variant: 'text' as const,
        disabled: selectedCount === 0
      });
      if (onEmptyTrash) buttons.push({
        label: '비우기',
        onClick: onEmptyTrash,
        variant: 'text' as const
      });
    }
  
    return buttons;
  };

  return (
    <div className="bg-[#F5F5F5] w-full">
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className="flex items-center ">
          <div className="mr-4 ">
            <CheckboxItem 
              checked={allSelected} 
              onChange={onSelectAll}
              id="select-all-mails"
            />
          </div>
          
          <ButtonGroup buttons={getButtons()} />
        </div>
        <div className="absolute left-1/2 transform flex items-center">
          {searchKeyword && (
            <>
              <button 
                onClick={handleClearSearch}
                className="px-8 mr-2 text-gray-400 hover:text-gray-700 flex items-center"
                aria-label="검색 결과 초기화"
              >
                <FaArrowLeft className="mr-1" size={12} />
                <span className="text-sm">전체목록</span>
              </button>
              <span className="text-sm text-gray-600">
                "{searchKeyword}" 검색 결과
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
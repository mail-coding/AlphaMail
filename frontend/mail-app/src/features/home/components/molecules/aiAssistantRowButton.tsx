import React from 'react';
import { Button } from '@/shared/components/atoms/button';

interface AiAssistantRowButtonProps {
  id: string;
  isOpen: boolean;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AiAssistantRowButton: React.FC<AiAssistantRowButtonProps> = ({ 
  id, 
  isOpen, 
  onView, 
  onDelete 
}) => {

  return (
    <div className="flex space-x-2">
      <Button
        variant="text"
        size="small"
        onClick={() => onView(id)}
      >
        {isOpen ? '닫기' : '보기'}
      </Button>
      <Button
        variant="text"
        size="small"
        onClick={() => onDelete(id)}
      >
        삭제
      </Button>
    </div>
  );
};
import React from 'react';
import { Button } from '@/shared/components/atoms/button';
import { ButtonGroup } from '../molecules/buttonGroup';
import { Typography } from '@/shared/components/atoms/Typography';

interface MailDetailHeaderProps {
  onBack: () => void;
  onReply: () => void;
  onDelete: () => void;
  source?: 'inbox' | 'sent' | 'trash';
}

export const MailDetailHeader: React.FC<MailDetailHeaderProps> = ({
  onBack,
  onReply,
  onDelete,
  source = 'inbox'
}) => {
    // 출처에 따라 버튼 구성 결정
    const getButtons = () => {
      const buttons = [];
      
      if (source !== 'trash' && source !== 'sent' && onReply) {
        buttons.push({
          label: '답장',
          onClick: onReply,
          variant: 'text' as const
        });
      }
      
      if (source !== 'trash' && onDelete) {
        buttons.push({
          label: '삭제',
          onClick: onDelete,
          variant: 'text' as const
        });
      }
      
      return buttons;
    };
  
  return (
    <div className="flex justify-between p-2 pl-0 bg-[#F5F5F5]">
      <Button variant="ghost" onClick={onBack} className="bg-[#F5F5F5] flex items-center gap-1  hover:bg-[#D4D4D4]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <Typography variant='titleSmall' className="text-[#616161]">뒤로</Typography>
      </Button>
      
      {/* 버튼 그룹 - 출처에 따라 다르게 표시 */}
      {getButtons().length > 0 && (
        <ButtonGroup buttons={getButtons()} />
      )}
    </div>
  );
};
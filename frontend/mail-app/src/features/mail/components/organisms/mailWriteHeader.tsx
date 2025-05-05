import React from 'react';
import { Button } from '@/shared/components/atoms/button';

interface MailWriteHeaderProps {
  onSend: () => void;
  onCancel: () => void;
  onAiAssistant: () => void;
  aiButtonWidth?: string;
  aiButtonHeight?: string;
  aiFontSize?: string;
  isSending?: boolean;
}

export const MailWriteHeader: React.FC<MailWriteHeaderProps> = ({
    onSend,
    onCancel,
    onAiAssistant,
    aiButtonWidth = '130px',
    aiButtonHeight = '30px',
    aiFontSize = '11px',
    isSending = false
  }) => {
    return (
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <Button variant="ghost" onClick={onCancel} className="flex items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          뒤로
        </Button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onAiAssistant}
            className="flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 hover:opacity-80"
            style={{
              background: 'linear-gradient(90deg, #62DDFF 0%, #9D44CA 100%)',
              width: aiButtonWidth,
              height: aiButtonHeight,
              fontSize: aiFontSize
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path 
                d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                fill="white"
              />
            </svg>
            AI 어시스턴트
          </button>
          <Button 
            variant="primary" 
            onClick={onSend}
            disabled={isSending}
          >
            {isSending ? '전송 중...' : '보내기'}
          </Button>
        </div>
      </div>
    );
};
import React from 'react';

interface MailDetailAiButtonProps {
  onAiAssistant: () => void;
  onTranslate: () => void;
  aiButtonWidth?: string;
  aiButtonHeight?: string;
  aiFontSize?: string;
}

export const MailDetailAiButton: React.FC<MailDetailAiButtonProps> = ({
  onAiAssistant,
  aiButtonWidth,
  aiButtonHeight,
  aiFontSize,
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* AI 어시스턴트 버튼 */}
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
          {/* 별 아이콘 */}
          <path 
            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
            fill="white"
          />
        </svg>
        AI 요약
      </button>
      
    </div>
  );
};
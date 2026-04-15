import React from 'react';

interface MailIconProps {
  isRead: boolean;
  isStarred?: boolean;
  hasAttachment?: boolean;
}

export const MailIcon: React.FC<MailIconProps> = ({ 
  isRead,
  hasAttachment
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* 읽음/안읽음 상태 아이콘 */}
      <div className="flex items-center justify-center w-6 h-6">
        {!isRead ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3H2C1.45 3 1 3.45 1 4V12C1 12.55 1.45 13 2 13H14C14.55 13 15 12.55 15 12V4C15 3.45 14.55 3 14 3ZM14 5L8 8.5L2 5V4L8 7.5L14 4V5Z" fill="#5F9CFD"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3H2C1.45 3 1 3.45 1 4V12C1 12.55 1.45 13 2 13H14C14.55 13 15 12.55 15 12V4C15 3.45 14.55 3 14 3ZM14 5L8 8.5L2 5V4L8 7.5L14 4V5Z" fill="#AFAFAF"/>
          </svg>
        )}
      </div>
      {/* 첨부파일 아이콘 */}
      {hasAttachment && (
        <div className="flex items-center justify-center w-6 h-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 4H10V2C10 1.45 9.55 1 9 1H7C6.45 1 6 1.45 6 2V4H2C1.45 4 1 4.45 1 5V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V5C15 4.45 14.55 4 14 4ZM8 11C6.9 11 6 10.1 6 9C6 7.9 6.9 7 8 7C9.1 7 10 7.9 10 9C10 10.1 9.1 11 8 11ZM9 4H7V2.5C7 2.22 7.22 2 7.5 2H8.5C8.78 2 9 2.22 9 2.5V4Z" fill="#3E99C6"/>
          </svg>
        </div>
      )}
    </div>
  );
};
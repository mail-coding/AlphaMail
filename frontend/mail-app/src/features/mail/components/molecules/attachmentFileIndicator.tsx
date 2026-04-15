import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface AttachmentFileIndicatorProps {
  id: number;
  name: string;
  size: number;
  onDownload: (id: number, name: string) => void;
}

export const AttachmentFileIndicator: React.FC<AttachmentFileIndicatorProps> = ({
  id,
  name,
  size,
  onDownload
}) => {
  // KB를 적절한 단위로 변환하는 함수
  const formatFileSize = (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} KB`;
    }
  };

  return (
    <div 
      className="flex items-center bg-gray-100 rounded px-3 py-2 cursor-pointer hover:bg-gray-200"
      onClick={() => onDownload(id, name)}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <path d="M11.3 5.3L6.7 9.9C6.3 10.3 5.7 10.3 5.3 9.9C4.9 9.5 4.9 8.9 5.3 8.5L9.9 3.9C10.7 3.1 12 3.1 12.8 3.9C13.6 4.7 13.6 6 12.8 6.8L7.5 12.1C6.3 13.3 4.4 13.3 3.2 12.1C2 10.9 2 9 3.2 7.8L8.5 2.5" 
              stroke="#3E99C6" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"/>
      </svg>
      <Typography variant="body" className="truncate max-w-[200px]">{name}</Typography>
      <Typography variant="caption" className="ml-2 text-gray-500">
        {formatFileSize(size)}
      </Typography>
    </div>
  );
};
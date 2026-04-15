import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface FileSizeDisplayProps {
  sizeInBytes: number;
  isRead?: boolean;
}

export const FileSizeDisplay: React.FC<FileSizeDisplayProps> = ({ 
  sizeInBytes,
  isRead = true
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + sizes[i];
  };

  return (
    <Typography 
      variant="caption"
      bold={!isRead}
      className="whitespace-nowrap w-[60px] text-right"
    >
      {formatFileSize(sizeInBytes)}
    </Typography>
  );
};

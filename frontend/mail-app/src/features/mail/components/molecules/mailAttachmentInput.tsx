import React, { useRef } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';
import { MailAttachment } from '../../stores/useMailStore';

interface MailAttachmentInputProps {
  attachments: MailAttachment[];
  onAddAttachment: (files: FileList) => void;
  onRemoveAttachment: (id: string) => void;
  isUploading?: boolean;
}

export const MailAttachmentInput: React.FC<MailAttachmentInputProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 크기를 읽기 쉬운 형식으로 변환 (KB, MB 등)
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex items-start mb-2">
      <Typography variant="body" className="w-20 pt-2 text-sm">
        파일첨부:
      </Typography>
      <div className="flex-1">
        <Button 
          variant="secondary" 
          onClick={() => fileInputRef.current?.click()}
          className="mb-2 mt-1 py-3 h-7"
          disabled={isUploading}
        >
          {isUploading ? '업로드 중...' : '파일 선택'}
        </Button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => e.target.files && onAddAttachment(e.target.files)}
          className="hidden" 
          multiple
        />
        
        {attachments.length > 0 && (
          <div className="mt-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between py-1 border-b border-gray-200">
                <div className="flex items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#3E99C6"/>
                  </svg>
                  <span className="text-xs">{attachment.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                </div>
                <button
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            ))}
            <div className="text-right text-xs text-gray-500 mt-1">
              {formatFileSize(attachments.reduce((acc, curr) => acc + curr.size, 0))}/6MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
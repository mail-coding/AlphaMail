import React, { useEffect, useRef, useState } from 'react';
import { MailRecipientInput } from '../molecules/mailRecipientInput';
import { MailSubjectInput } from '../molecules/mailSubjectInput';
import { MailAttachmentInput } from '../molecules/mailAttachmentInput';
import { MailQuillEditor } from '../molecules/mailQuillEditor';
import { toast } from 'react-toastify';
import { useMailStore } from '../../stores/useMailStore';
import { Typography } from '@/shared/components/atoms/Typography';


interface MailWriteFormProps {
  initialTo: string[];
  initialSubject: string;
  initialContent: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
  onRecipientsChange: (recipients: string[]) => void;
  fontOptions: { value: string; label: string }[];
  onRecipientFocus?: () => void;
  onRecipientBlur?: () => void;
  showRecentRecipients?: boolean;
  recentRecipients?: Array<{ name?: string; email: string }>;
  onSelectRecipient?: (email: string) => void;
}

export const MailWriteForm: React.FC<MailWriteFormProps> = ({
  initialTo,
  initialSubject,
  initialContent,
  onContentChange,
  onSubjectChange,
  onRecipientsChange,
  fontOptions,
  onRecipientFocus,
  onRecipientBlur,
  showRecentRecipients,
  recentRecipients,
  onSelectRecipient
}) => {
  const isFirstRender = useRef(true);
  const { 
    attachments, 
    addAttachment, 
    removeAttachment, 
    content: storeContent,
    setContent : setStoreContent
  } = useMailStore();

  const [to, setTo] = useState<string[]>(initialTo);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const MAX_ATTACHMENT_SIZE = 6 * 1024 * 1024;
  const MAX_TOTAL_ATTACHMENTS_SIZE = 6 * 1024 * 1024;

  // 초기화 시 스토어 content 설정
  useEffect(() => {
    // 초기 렌더링 시에만 실행되도록 ref 사용    
    if (isFirstRender.current && initialContent) {
      setStoreContent(initialContent);
      isFirstRender.current = false;
    }
  }, [initialContent, setStoreContent]);  
  
  // storeContent가 변경될 때 부모 컴포넌트에 알림
  useEffect(() => {
    console.log('스토어 콘텐츠 변경 감지:', storeContent ? storeContent + '...' : '빈 콘텐츠');
    onContentChange(storeContent);
  }, [storeContent, onContentChange]);
  
  useEffect(() => {
    setTo(initialTo);
    onRecipientsChange(initialTo);
  }, [initialTo, onRecipientsChange]);

  useEffect(() => {
    setSubject(initialSubject);
    onSubjectChange(initialSubject);
  }, [initialSubject, onSubjectChange]);

  const handleAddRecipient = (email: string) => {
    const newTo = [...to, email];
    setTo(newTo);
    onRecipientsChange(newTo);
  };
  
  const handleRemoveRecipient = (index: number) => {
    const newTo = [...to];
    newTo.splice(index, 1);
    setTo(newTo);
    onRecipientsChange(newTo);
  };
  
  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    onSubjectChange(newSubject);
  };
  
  const handleContentChange = (newContent: string) => {
    console.log('메일 폼 - 콘텐츠 변경 핸들러:', newContent.substring(0, 50) + '...');
    setStoreContent(newContent);
  };

  const handleAddAttachment = async (files: FileList) => {
    // 현재 첨부파일의 총 크기 계산
    const currentTotalSize = attachments.reduce((total, attachment) => {
      return total + attachment.size;
    }, 0);
    
    // 새 파일들 처리
    for (const file of files) {
      // 중복 파일 확인
      const isDuplicate = attachments.some(
        attachment => attachment.name === file.name && attachment.size === file.size
      );
      
      if (isDuplicate) {
        // 고유 ID를 가진 토스트 생성
        toast.warning(`중복된 파일은 업로드할 수 없습니다: ${file.name}`, {
          toastId: `duplicate-${file.name}-${Date.now()}` // 고유 ID 생성
        });
        continue; // 중복 파일은 건너뜀
      }
      
      // 개별 파일 크기 검사
      if (file.size > MAX_ATTACHMENT_SIZE) {
        toast.error(`${file.name}의 크기가 6MB를 초과합니다. 6MB 이하의 파일만 첨부 가능합니다.`, {
          toastId: `size-${file.name}-${Date.now()}` // 고유 ID 생성
        });
        continue;
      }
      
      // 총 첨부파일 크기 검사
      if (currentTotalSize + file.size > MAX_TOTAL_ATTACHMENTS_SIZE) {
        toast.error('총 첨부파일 크기가 6MB를 초과합니다.', {
          toastId: `total-size-${Date.now()}` // 고유 ID 생성
        });
        break;
      }
      
      // 파일 추가 (API 호출 대신 스토어에 직접 추가)
      setIsUploading(true);
      
      try {
        // 약간의 지연 시간을 주어 업로드 중인 느낌을 줌
        setTimeout(() => {
          addAttachment(file);
          setIsUploading(false);
        }, 500);
      } catch (error) {
        toast.error(`파일 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, {
          toastId: `error-${Date.now()}` // 고유 ID 생성
        });
        setIsUploading(false);
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    removeAttachment(id);
  };
  
  return (
    <div className="flex flex-col flex-1">
      <div className="p-4 border-b border-gray-200">
      <div className="relative">
          <MailRecipientInput
            label="받는 사람"
            recipients={to}
            onAddRecipient={handleAddRecipient}
            onRemoveRecipient={handleRemoveRecipient}
            onFocus={onRecipientFocus}
            onBlur={onRecipientBlur}
          />
            
          {/* 최근 수신자 목록 UI */}
          {showRecentRecipients && recentRecipients && recentRecipients.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {recentRecipients.map((recipient, index) => (
              <div 
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => onSelectRecipient?.(recipient.email)}
              >
                {recipient.name ? (
                  <span className="flex items-center">
                    <Typography variant="body" className="font-medium">
                      {recipient.name}
                    </Typography>
                    <Typography variant="body" className="text-gray-500 ml-2">
                      {recipient.email}
                    </Typography>
                  </span>
                ) : (
                  <Typography variant="body">
                    {recipient.email}
                  </Typography>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
                
        <MailSubjectInput
          subject={subject}
          onChange={handleSubjectChange}
        />
        
        <MailAttachmentInput
          attachments={attachments}
          onAddAttachment={handleAddAttachment}
          onRemoveAttachment={handleRemoveAttachment}
          isUploading={isUploading}
        />
      </div>
      
      <div className="flex-1">
        <MailQuillEditor
          content={storeContent}
          onChange={handleContentChange}
          fontOptions={fontOptions}
        />
      </div>
      
    </div>
  );
};
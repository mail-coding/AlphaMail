import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { MailSubject } from '../molecules/mailSubject';
import { MailDetailAiButton } from '../molecules/mailDetailAiButton';
import { addHours, format } from 'date-fns';
import { ko } from 'date-fns/locale';


interface MailMetadataProps {
  subject?: string;
  sender?: string;
  recipients?: string[];
  receivedDateTime?: string;
  onAiAssistant?: () => void;
  onTranslate?: () => void;
}

export const MailMetadata: React.FC<MailMetadataProps> = ({
  subject,
  sender,
  recipients,
  receivedDateTime,
  onAiAssistant = () => console.log('AI 어시스턴트 클릭'),
  onTranslate = () => console.log('번역 클릭')

}) => {
    // useEffect(() => {
    //   console.log('MailMetadata에 전달된 recipients:', recipients);
    // }, [recipients]);
    
    const formatKoreanDateTime = (date: Date): string => {
      const koreaDate = addHours(date, 9);
      
      return format(koreaDate, 'yyyy년 M월 d일 (E) a h:mm', { locale: ko });
    };
  
  return (
    <div className="px-6 py-4">
      {/* 메일 제목 */}
      <div className="mb-4">
        <MailSubject subject={subject || ''} isRead={true} variant="detail" />
      </div>
      
      {/* AI 어시스턴트 및 번역 버튼 */}
      <MailDetailAiButton 
        onAiAssistant={onAiAssistant}
        onTranslate={onTranslate}
        aiButtonWidth="120px" 
        aiButtonHeight="30px"
        aiFontSize="11px"
      />

      {/* 발신자 정보 */}
      <div className="mb-2">
        <div className="flex items-center">
          <Typography variant="body" className="text-gray-600 mr-2">
            <span>보낸 사람:</span>
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Typography variant="body">
              <span className="bg-[#CDECFC] px-2 py-1 rounded">
                {sender || '알 수 없음'}
              </span>
            </Typography>
          </div>
        </div>
      </div>
      
      {/* 수신자 정보 */}
      <div className="mb-2">
        <div className="flex items-center">
          <Typography variant="body" className="text-gray-600 mr-2">
            <span>받는 사람:</span>
          </Typography>
          <div className="flex flex-wrap gap-2">
            {recipients && recipients.map((recipient, index) => (
              <Typography key={index} variant="body">
                <span className="bg-[#CDECFC] px-2 py-1 rounded">
                  {recipient}
                </span>
              </Typography>
            ))}
          </div>
        </div>
      </div>
      
      {/* 날짜 정보 - 한 줄에 표시 */}
      <div className="mb-4 mt-2">
        <div className="flex items-center">
          <Typography variant="body" className="text-gray-600 mr-2">
            <span>보낸 날짜:</span>
          </Typography>
          <Typography variant="body">
            {receivedDateTime ? formatKoreanDateTime(new Date(receivedDateTime)) : ''}
          </Typography>
        </div>
      </div>
    </div>
  );
};
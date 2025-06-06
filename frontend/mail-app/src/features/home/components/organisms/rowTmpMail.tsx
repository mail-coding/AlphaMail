import React from 'react';
import { TmpMailSubject } from '../molecules/tmpMailSubject';
import { TmpMailSender } from '../molecules/tmpMailSender';
import { TmpMailRecipient } from '../molecules/tmpMailRecipient';
import { TmpMailDate } from '../molecules/tmpMailDate';
import { TmpMailAttachments } from '../molecules/tmpMailAttachments';
import { TmpMailContents } from '../molecules/tmpMailContents';
import { useHome } from '../../hooks/useHome';
import { Typography } from '@/shared/components/atoms/Typography';
import { AssistantType } from '../../types/home';
import { Attachment } from '@/features/mail/types/mail';

interface RowTmpMailProps {
  type?: AssistantType;
  id?: number;
}

export const RowTmpMail: React.FC<RowTmpMailProps> = ({ type, id }) => {
  const { useEmailByType } = useHome();
  const { data: detailData, isLoading } = useEmailByType(type as AssistantType || null, id || null);

  const getAttachments = () => {
    if (!detailData) return [];
    
    // 모든 타입에 대해 동일한 방식으로 첨부파일 처리
    return 'emailAttachments' in detailData ? detailData.emailAttachments || [] : [];
  };

  // API 데이터 형식에 맞게 변환
  const formattedMailData = {
    subject: detailData?.email?.subject || '',
    sender: detailData?.email?.sender?.split('<')[0].trim().replace(/"/g, '') || '',
    recipients: detailData?.email?.recipients || [],
    date: detailData?.email?.receivedDateTime || '',
    attachments: getAttachments() as Attachment[],
    content: detailData?.email?.bodyText || '',
    emailId: detailData?.email?.emailId || 0
  };

  if (isLoading) {
    return (
      <div className="mt-3 bg-[#F6F7F7] rounded-md p-4">
        <div className="flex justify-center">
          <Typography variant="titleMedium">이메일 로딩 중...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-[#F6F7F7]  p-5">
      <div className="flex flex-col md:flex-row">
        {/* 왼쪽 영역: 메일 정보 */}
        <div className="md:w-1/2 pr-4 border-r border-gray-200">
          <TmpMailSubject subject={formattedMailData.subject} />
          <TmpMailSender name={formattedMailData.sender} />
          <TmpMailRecipient emails={formattedMailData.recipients} />
          <TmpMailDate date={formattedMailData.date} />
          <TmpMailAttachments attachments={formattedMailData.attachments} emailId={formattedMailData.emailId} />
        </div>
        
        {/* 오른쪽 영역: 메일 본문 */}
        <div className="md:w-1/2 pl-4 md:max-h-[300px]">
          <TmpMailContents content={formattedMailData.content} />
        </div>
      </div>
    </div>
  );
};
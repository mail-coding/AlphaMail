import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { useMail } from '@/features/mail/hooks/useMail';
import { showToast } from '@/shared/components/atoms/toast';

interface Attachment {
  id?: number;
  name: string;
  size: number;
  type: string;
}

interface TmpMailAttachmentsProps {
  attachments: Attachment[];
  emailId?: number;
}

export const TmpMailAttachments: React.FC<TmpMailAttachmentsProps> = ({ attachments, emailId }) => {
  const { downloadAttachment } = useMail();
  
  if (attachments.length === 0) return null;
  
  const handleDownload = (attachment: Attachment) => {
    if (!emailId || !attachment.id) {
      showToast('다운로드에 필요한 정보가 없습니다.', 'error');
      return;
    }
    
    downloadAttachment.mutate({
      mailId: emailId,
      attachmentId: attachment.id,
      fileName: attachment.name
    });
  };

  return (
    <div className="mb-2">
      <div className="flex mb-1">
        <Typography variant="body" className="text-gray-600 w-20">
          첨부 {attachments.length}개
        </Typography>
      </div>
      
      <div className="ml-20">
        {attachments.map((attachment, index) => (
          <div key={index} className="border bg-white border-gray-300 rounded-md p-2 mb-1 flex items-center">
            <div className="w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-sm mr-2">
              <span className="text-xs">file</span>
            </div>
            <div
              className="cursor-pointer hover:text-blue-500 hover:underline text-xs font-pretendard"
              onClick={() => handleDownload(attachment)}
            >
              {attachment.name}
            </div>
            <div className="flex ml-auto space-x-2">
              {/* <Typography variant="body" className="text-gray-500">
                {attachments.reduce((acc, curr) => acc + (typeof curr.size === 'string' ? parseInt(curr.size) : curr.size), 0)}KB
              </Typography> */}
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => handleDownload(attachment)}
                title="다운로드"
              >
                <img src="/download_icon.png" alt="Chatbot" style={{ width: 25, height: 25, objectFit: 'contain' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { AttachmentFileIndicator } from '../molecules/attachmentFileIndicator';
import { Attachment } from '../../types/mail';

interface AttachmentListProps {
  attachments: Attachment[];
  onDownload: (id: number, name: string) => void;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onDownload
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }
  
  return (
    <div className="px-4 mb-4 pb-4">
      <Typography variant="body" className="text-gray-600 mb-2">첨부 파일:</Typography>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <AttachmentFileIndicator
            key={attachment.id}
            id={attachment.id}
            name={attachment.name}
            size={attachment.size}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};
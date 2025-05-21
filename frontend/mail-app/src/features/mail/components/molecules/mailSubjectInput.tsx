import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface MailSubjectInputProps {
  subject: string;
  onChange: (subject: string) => void;
}

export const MailSubjectInput: React.FC<MailSubjectInputProps> = ({
  subject,
  onChange
}) => {
  return (
    <div className="flex items-center mb-2">
      <Typography variant="body" className="w-20 text-sm">
        제목:
      </Typography>
      <input 
        type="text" 
        value={subject}
        onChange={(e) => onChange(e.target.value)}
        placeholder="제목을 입력하세요"
        className="flex-1 outline-none border-b border-gray-300 py-3 text-sm h-5"
      />
    </div>
  );
};
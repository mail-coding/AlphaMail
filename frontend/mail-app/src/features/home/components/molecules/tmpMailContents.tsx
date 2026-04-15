import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface TmpMailContentsProps {
  content: string;
}

export const TmpMailContents: React.FC<TmpMailContentsProps> = ({ content }) => {
  // Split content by periods or hyphens while preserving them
  const formattedContent = content
    .split(/(?=-)|(?<=\.)/)
    .map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {part.endsWith('.') && <br />}
        {index < array.length - 1 && array[index + 1]?.startsWith('-') && <br />}
      </React.Fragment>
    ));

  return (
    <div className="p-4 rounded-md h-full overflow-auto">
      <Typography variant="body" className="text-[14px]">
        {formattedContent}
      </Typography>
    </div>
  );
};
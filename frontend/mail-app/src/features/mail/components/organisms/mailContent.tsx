import React from 'react';
import { Typography } from '@/shared/components/atoms/Typography';

interface MailContentProps {
  bodyHtml?: string;
  bodyText?: string;
}

export const MailContent: React.FC<MailContentProps> = ({
  bodyHtml,
  bodyText
}) => {
    // 기본 스타일을 추가하여 Heading, 목록 등이 제대로 표시되도록 함
    const styleTag = `
    <style>
      .mail-content-html h1 { font-size: 2em; font-weight: bold; margin-top: 0.67em; margin-bottom: 0.67em; }
      .mail-content-html h2 { font-size: 1.5em; font-weight: bold; margin-top: 0.83em; margin-bottom: 0.83em; }
      .mail-content-html h3 { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 1em; }
      .mail-content-html ul { display: block; list-style-type: disc; margin-top: 1em; margin-bottom: 1em; padding-left: 40px; }
      .mail-content-html ol { display: block; list-style-type: decimal; margin-top: 1em; margin-bottom: 1em; padding-left: 40px; }
      .mail-content-html li { display: list-item; }
      .mail-content-html .ql-align-center { text-align: center; }
      .mail-content-html .ql-align-right { text-align: right; }
      .mail-content-html .ql-align-justify { text-align: justify; }
      .mail-content-html .ql-indent-1 { padding-left: 3em; }
      .mail-content-html .ql-indent-2 { padding-left: 6em; }
      .mail-content-html a { color: #0066cc; text-decoration: underline; }
    </style>
  `;
  
  // HTML 내용에 스타일 태그 추가
  const enhancedHtml = bodyHtml ? styleTag + bodyHtml : null;
  
  return (
    <div className="mail-content px-6 py-4 overflow-auto">
      {enhancedHtml ? (
        <div 
          className="font-pretendard text-[12px] text-gray-900 mail-content-html" 
          dangerouslySetInnerHTML={{ __html: enhancedHtml }} 
        />
      ) : (
        <Typography variant="body" className="whitespace-pre-line">
          {bodyText}
        </Typography>
      )}
    </div>
  );
};
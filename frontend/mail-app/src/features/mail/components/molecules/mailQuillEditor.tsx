import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Quill 스타일시트
import { toast } from 'react-toastify';

// 커스텀 스타일 추가
const customStyles = {
  quillContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  editor: {
    fontFamily: '맑은 고딕, 굴림, 돋움, 바탕, sans-serif',
    height: '100%',
    flex: '1 1 auto',
    border: 'none', // 테두리 제거
  },
  customClass: {
    '& .ql-container.ql-snow': {
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    },
    '& .ql-toolbar.ql-snow': {
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: '1px solid #ccc',
    },
    '& .imported-html-content': {
      width: '100%',
      maxWidth: '100%',
      '& *': {
        maxWidth: '100%',
      },
    },
  },
};

// 최대 용량 설정 (1MB = 1 * 1024 * 1024 바이트)
const MAX_CONTENT_SIZE_BYTES = 1 * 1024 * 1024;

interface MailQuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  fontOptions?: Array<{ value: string; label: string }>;
}

export const MailQuillEditor: React.FC<MailQuillEditorProps> = ({
  content,
  onChange,
  fontOptions,
}) => {
  const originalHtmlRef = useRef<string | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const [value, setValue] = useState(content);
  const isInternalChange = useRef(false);
  const [contentSize, setContentSize] = useState<number>(0);
  const [isMaxSizeReached, setIsMaxSizeReached] = useState<boolean>(false);

  // 콘텐츠 크기 계산 함수
  const calculateContentSize = (htmlContent: string): number => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(htmlContent);
    return bytes.length;
  };

  // 초기 콘텐츠 크기 계산
  useEffect(() => {
    if (content) {
      const size = calculateContentSize(content);
      setContentSize(size);
      setIsMaxSizeReached(size >= MAX_CONTENT_SIZE_BYTES);
    }
  }, [content]);

  // 에디터 변경 핸들러
  const handleChange = (newContent: string) => {
    const newSize = calculateContentSize(newContent);
    isInternalChange.current = true;
    setValue(newContent);

    // 최대 크기 초과 여부 확인
    if (newSize <= MAX_CONTENT_SIZE_BYTES) {
      setContentSize(newSize);

      if (originalHtmlRef.current) {
        console.log('원본 HTML 사용:', originalHtmlRef.current.substring(0, 50) + '...');
        onChange(originalHtmlRef.current);
        originalHtmlRef.current = null; // 원본 사용 후 초기화
      } else {
        onChange(newContent);
      }
    } else {
      toast.error('메일 본문이 최대 용량(1MB)을 초과했습니다.'); // 토스트 알림 추가
    }
  };

  // content prop이 변경될 때 HTML 처리
  useEffect(() => {
    if (!isInternalChange.current && content !== value) {
      if (content && (content.includes('<html>') || content.includes('<!DOCTYPE html>'))) {
        try {
          originalHtmlRef.current = content;

          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const styles = Array.from(doc.querySelectorAll('style'))
            .map(style => style.textContent)
            .join('\n');
          const bodyContent = doc.body.innerHTML;

          const processedContent = `
            <div class="imported-html-content">
              <style>${styles}</style>
              ${bodyContent}
            </div>
          `;

          setValue(processedContent); // HTML을 Quill 에디터에 반영
        } catch (error) {
          console.error('HTML 파싱 오류:', error);
          setValue(content);
        }
      } else {
        setValue(content); // HTML 아닌 경우 그대로 설정
      }
    }

    // 플래그 초기화
    isInternalChange.current = false;
  }, [content, value]);

  // Quill 에디터에 HTML 삽입
  useEffect(() => {
    if (quillRef.current && content && content !== value) {
      const editor = quillRef.current.getEditor();
      editor.clipboard.dangerouslyPasteHTML(content); // HTML 삽입
    }
  }, [content, value]);

  // 폰트 옵션을 Quill에 등록
  useEffect(() => {
    if (fontOptions && fontOptions.length > 0) {
      const Font = ReactQuill.Quill.import('formats/font') as any;
      Font.whitelist = fontOptions.map(option => option.value);
      ReactQuill.Quill.register(Font, true);
    }
  }, [fontOptions]);

  // Quill 에디터 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'font': fontOptions?.map(option => option.value) }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
      ],
    },
    clipboard: {
      matchVisual: false, // HTML을 그대로 붙여넣을 수 있도록 설정
    },
  };

  // Quill 에디터 포맷 설정
  const formats = [
    'header',
    'font',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'indent',
    'link', 'image',
    'color', 'background',
    'align',
  ];

  // 용량 표시기 컴포넌트
  const SizeIndicator = () => {
    const percentage = (contentSize / MAX_CONTENT_SIZE_BYTES) * 100;
    const isNearLimit = percentage > 80;
    const isAtLimit = percentage >= 100;

    return (
      <div className="text-xs flex items-center mb-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
          <div 
            className={`h-2 rounded-full ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <span className={`${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-500'}`}>
          {(contentSize / (1024 * 1024)).toFixed(2)}MB / 1MB
        </span>
      </div>
    );
  };

  return (
    <div className="mail-editor h-full flex flex-col" style={customStyles.quillContainer}>
      <style>{`
        .ql-container.ql-snow {
          border-bottom: none;
          border-left: none;
          border-right: none;
        }
        .ql-toolbar.ql-snow {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #ccc;
        }
      `}</style>

      <SizeIndicator />

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="내용을 입력하세요..."
        style={customStyles.editor}
      />
    </div>
  );
};

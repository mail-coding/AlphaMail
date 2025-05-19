import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Quill 스타일시트

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
  // 하단 줄 제거를 위한 스타일
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
    }
  }
};

interface MailQuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  fontOptions?: Array<{ value: string; label: string }>;
}
interface QuillLinkBlot {
  create: (value: string) => HTMLElement;
  // 필요한 다른 속성들...
}

export const MailQuillEditor: React.FC<MailQuillEditorProps> = ({
  content,
  onChange,
  fontOptions
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // 폰트 옵션을 Quill에 등록
  useEffect(() => {
    if (fontOptions && fontOptions.length > 0) {
      const Font = ReactQuill.Quill.import('formats/font') as any;

      Font.whitelist = fontOptions.map(option => option.value);

      ReactQuill.Quill.register(Font, true);
      }
  }, [fontOptions]);
  
  // 링크 삽입 핸들러 커스터마이징
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      
      // 기본 링크 포맷터 가져오기
      const LinkBlot = editor.scroll.query('link') as unknown as QuillLinkBlot;
      
      // 링크 포맷터 재정의
      if (LinkBlot) {
        const originalCreate = LinkBlot.create;
        LinkBlot.create = function(value: string) {
          // 상대 URL이 아닌 경우에만 처리
          if (value && !/^(https?:\/\/|mailto:|tel:|ftp:|#)/.test(value)) {
            // http:// 접두사 추가
            value = 'http://' + value;
          }
          return originalCreate.call(this, value);
        };
      }
    }
  }, []);
  
  // 한글 입력 최적화를 위한 설정
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      
      // 에디터 DOM 요소에 접근
      const editorElement = editor.root;
      
      // 한글 입력 모드 설정
      editorElement.setAttribute('style', 'ime-mode: active;');
      
      // 조합 이벤트 처리
      editorElement.addEventListener('compositionstart', () => {
        console.log('한글 조합 시작');
      });
      
      editorElement.addEventListener('compositionend', () => {
        console.log('한글 조합 종료');
        // 필요시 추가 처리
      });
    }
  }, []);

  // Quill 에디터 모듈 설정
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': fontOptions?.map(option => option.value) }], // 폰트 옵션 추가
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image']
      ],
    keyboard: {
      bindings: {
        // 한글 입력 관련 키보드 바인딩 설정
        // 필요시 추가 가능
      }
    }
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
    'align'
    ];

  return (
    <div className="mail-editor h-full flex flex-col" style={{
      ...customStyles.quillContainer
    }}>
      <style>{`
      .ql-container.ql-snow{
        border-bottom: none;
        border-left: none;
        border-right: none;
      }
      .ql-toolbar.ql-snow{
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #ccc;
      }
      
      /* 폰트 선택기 스타일 */
      .ql-font .ql-picker-label::before {
        content: "글꼴";
      }
      
      /* 각 폰트 옵션 스타일 */
      ${fontOptions?.map(font => {
        // 폰트 이름과 실제 CSS 폰트 패밀리 매핑
        const fontFamilyMap: { [key: string]: string } = {
          'pretendard': 'Pretendard',
          'notosans': 'Noto Sans KR',
          'nanumgothic': 'Nanum Gothic',
          'nanummyeongjo': 'Nanum Myeongjo',
          'spoqa': 'Spoqa Han Sans Neo',
          'gowundodum': 'Gowun Dodum',
          'gowunbatang': 'Gowun Batang',
          'ibmplex': 'IBM Plex Sans KR'
        };
        
        const fontFamily = fontFamilyMap[font.value] || font.value;
        
        return `
          .ql-font-${font.value} {
            font-family: '${fontFamily}', sans-serif;
          }
          .ql-picker-item[data-value="${font.value}"]::before {
            content: '${font.label}';
            font-family: '${fontFamily}', sans-serif;
          }
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="${font.value}"]::before {
            content: '${font.label}' !important;
            font-family: '${fontFamily}', sans-serif !important;
          }
        `;
      }).join('\n')}      
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder=""
        style={customStyles.editor}
      />
    </div>
  );
};
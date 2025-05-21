import React, { useEffect } from 'react';
import AiLoading from '../organisms/aiLoading';
import AiTemplateList from '../organisms/aiTemplateList';
import AiSummary from '../organisms/aiSummary';
import { Typography } from '@/shared/components/atoms/Typography';
import { useAiStore } from '../../stores/useAiStore';
import { useMailStore } from '../../stores/useMailStore';
// import AiSendPrompt from '../molecules/aiSendPrompt';

interface AiPageTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  mailContent?: string; // 메일 내용 (선택적)
  mailId?: number; // 메일 ID 추가
  mode?: 'summary' | 'template'; // 모드 추가: summary(메일 상세) 또는 template(메일 작성)
}

const AiPageTemplate: React.FC<AiPageTemplateProps> = ({
  isOpen, 
  onClose, 
  mailContent,
  mailId,
  mode = 'summary'
}) => {
  // useAiStore에서 필요한 상태와 액션 가져오기
  const { 
    isAnalyzing, 
    startAnalysis, 
    setAnalysisResult,
    clearAnalysisResult,
    setIsOpen
  } = useAiStore();
  
  const { setContent } = useMailStore();

  // 템플릿 적용 핸들러
  const handleApplyTemplate = (templateContent: string) => {
    setContent(templateContent);
  };

  // AI 어시스턴트 닫기 핸들러
  const handleCloseAssistant = () => {
    onClose();
    setIsOpen(false);
  };

  useEffect(() => {
    // AI 스토어의 isOpen 상태 동기화
    setIsOpen(isOpen);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && mode === 'summary' && mailContent) {
      // 분석 시작
      startAnalysis();
      
      // 실제 API 호출 대신 타이머로 시뮬레이션 (나중에 실제 API로 대체)
      const timer = setTimeout(() => {
        setAnalysisResult('이 메일은 학사경고 관련 내용입니다. 김태희 학생이 학사경고를 받았으며, 4월 22일까지 리포트를 제출해야 합니다.');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, mailContent, mode, startAnalysis, setAnalysisResult]);
  
  // 컴포넌트가 언마운트될 때 분석 결과 초기화
  useEffect(() => {
    return () => {
      clearAnalysisResult();
    };
  }, [clearAnalysisResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ease-in-out"
         style={{ 
           width: '400px', 
           marginTop: '64px',
           height: 'calc(100vh - 64px)',
           boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)'
         }}>
      <div className="flex justify-center items-center p-4 bg-gradient-to-r from-[#62DDFF] to-[#3E5DE8] relative">
        <Typography variant="titleMedium" bold className="text-white">
          {mode === 'summary' ? 'AI 스레드 요약' : 'AI 메일 템플릿'}
        </Typography>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 absolute right-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {mode === 'summary' ? (
        // 메일 상세 페이지에서 사용할 요약 컴포넌트
        <div className="h-full overflow-auto">
          {isAnalyzing ? (
            <AiLoading />
          ) : (
            <AiSummary emailId={mailId?.toString() || ''} />
          )}
        </div>
      ) : (
        // 메일 작성 페이지에서 사용할 템플릿 컴포넌트
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <AiTemplateList 
              onApplyTemplate={handleApplyTemplate}
              onCloseAssistant={handleCloseAssistant}
            />
          </div>
          <div className="h-14"></div>
        </div>
      )}
    </div>
  );
};

export default AiPageTemplate;
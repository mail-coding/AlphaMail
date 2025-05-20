import React, { useEffect } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { useAiStore } from '../../stores/useAiStore';
import { Button } from '@/shared/components/atoms/button';
import { useEmailTemplate } from '../../hooks/useAiMail';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface AiTemplateDetailProps {
  onApplyTemplate: (content: string) => void;
  onCloseAssistant: () => void;
}

const AiTemplateDetail: React.FC<AiTemplateDetailProps> = ({ onApplyTemplate, onCloseAssistant }) => {
  const { selectedTemplateId, setIsEditing } = useAiStore();
  const queryClient = useQueryClient();

  // 템플릿 ID를 숫자로 변환
  const templateId = selectedTemplateId ? parseInt(selectedTemplateId) : 0;
  
  // API에서 템플릿 상세 정보 가져오기
  const { data: template, isLoading, isError, refetch } = useEmailTemplate(templateId);

  useEffect(() => {
    // 템플릿 데이터 다시 가져오기
    refetch();
    
    // 또는 쿼리 캐시 무효화
    queryClient.invalidateQueries({ queryKey: ['emailTemplate', templateId] });
  }, [templateId, refetch, queryClient]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleApplyTemplate = () => {
    // 메일 본문에 템플릿 내용을 적용하는 로직
    if (template?.generatedContent) {
      try {
        
        // 콜백을 통해 부모 컴포넌트로 템플릿 내용 전달
        onApplyTemplate(template.generatedContent);
        
        // 성공 메시지 표시
        toast.success('템플릿이 메일에 적용되었습니다.', {
          toastId: `template-applied-${Date.now()}`
        });
        
        // AI 어시스턴트 패널 닫기
        onCloseAssistant();
        
        console.log('템플릿 적용 완료');
      } catch (error) {
        console.error('템플릿 적용 중 오류:', error);
        toast.error('템플릿 적용 중 오류가 발생했습니다.', {
          toastId: `template-error-${Date.now()}`
        });
      }
    } else {
      toast.warning('적용할 템플릿 내용이 없습니다.', {
        toastId: `template-empty-${Date.now()}`
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#E1F3FD] p-6 rounded-lg h-full flex items-center justify-center">
        <Typography variant="body">템플릿 정보를 불러오는 중...</Typography>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="bg-[#E1F3FD] p-6 rounded-lg h-full flex items-center justify-center">
        <Typography variant="body" className="text-red-500">템플릿 정보를 불러오는데 실패했습니다.</Typography>
      </div>
    );
  }

  return (
    <div className="bg-[#E1F3FD] p-6 rounded-lg h-full">
      {/* 상단 안내 메시지 */}
      <div className="bg-white rounded-lg p-3 mb-6 text-center border border-[#2D95CE]">
        <Typography variant="body" className="text-[#2D95CE]">
          템플릿을 메일에 적용하거나 수정할 수 있어요
        </Typography>
      </div>
      
      {/* 템플릿 제목 */}
      <div className="mb-4">
        <Typography variant="titleSmall" className="mb-2">
          제목
        </Typography>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Typography variant="body">{template.title}</Typography>
        </div>
      </div>
      
      {/* 템플릿 내용 */}
      <div className="mb-6">
        <Typography variant="titleSmall" className="mb-2">
          내용
        </Typography>
        <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[200px]">
          {template.generatedContent ? (
            <iframe 
              srcDoc={template.generatedContent}
              title="템플릿 내용"
              className="w-full border-none min-h-[200px]"
              style={{ height: '100%', minHeight: '200px' }}
            />
          ) : (
            <Typography variant="body">
              템플릿 내용이 없습니다.
            </Typography>
          )}
        </div>
      </div>
                                          
      {/* 버튼 영역 */}
      <div className="flex justify-between">
        <Button 
          variant="secondary"
          onClick={handleEdit}
          className="mx-2 py-4"
        >
          템플릿 수정
        </Button>
        
        <Button 
          variant="primary"
          onClick={handleApplyTemplate}
          className="mx-2 py-4"
        >
          메일에 적용
        </Button>
      </div>
    </div>
  );
};

export default AiTemplateDetail;
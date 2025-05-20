import React, { useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import AiTemplateAdd from '../molecules/aiTemplateAdd';
import AiTemplateCell from '../molecules/aiTemplateCell';
import AiTemplateEdit from './aiTemplateDetailEdit';
import AiTemplateDetail from './aiTemplateDetail';
import AiLoading from './aiLoading';
import { useAiStore } from '../../stores/useAiStore';
import { useEmailTemplates, useDeleteEmailTemplate } from '../../hooks/useAiMail';

interface AiTemplateListProps {
  onApplyTemplate: (content: string) => void;
  onCloseAssistant: () => void;
}

const AiTemplateList: React.FC<AiTemplateListProps> = ({ onApplyTemplate, onCloseAssistant }) => {
  // useAiStore에서 상태와 액션 가져오기
  const { 
    selectedTemplateId, 
    selectTemplate, 
    clearSelectedTemplate, 
    isAddingNewTemplate,
    setAddingNewTemplate,
    isEditing,
    setIsEditing
  } = useAiStore();
  
  // 로딩 상태 관리
  const [isGenerating, setIsGenerating] = useState(false);

  // API에서 템플릿 목록 가져오기
  const { data, isLoading, isError } = useEmailTemplates();
  
  // 템플릿 데이터가 배열인지 확인하고 안전하게 사용
  const templates = Array.isArray(data) ? data : [];
  
  // 템플릿 삭제 뮤테이션
  const deleteTemplateMutation = useDeleteEmailTemplate();

  // 새 템플릿 추가 핸들러
  const handleAddTemplate = () => {
    console.log('새 템플릿 추가');
    setAddingNewTemplate(true);
    setIsEditing(true); // 새 템플릿은 바로 편집 모드로
    // 임시 ID로 템플릿 선택 (실제로는 새 템플릿 ID 생성 필요)
    selectTemplate('new');
  };
  
  // 템플릿 선택 핸들러
  const handleSelectTemplate = (id: number) => {
    console.log(`템플릿 선택: ${id}`);
    selectTemplate(id.toString());
    setIsEditing(false); // 기존 템플릿은 상세 보기 모드로
  };

  // 템플릿 삭제 핸들러
  const handleDeleteTemplate = (id: number) => {
    deleteTemplateMutation.mutate(id);
  };

  // 템플릿 편집 화면에서 뒤로가기 핸들러
  const handleBackToList = () => {
    clearSelectedTemplate();
    setAddingNewTemplate(false);
    setIsEditing(false);
  };

  // 상단 버튼 클릭 핸들러 - 새 템플릿 생성 시 목록으로 바로 이동하도록 수정
  const handleBackButtonClick = () => {
    if (isEditing && isAddingNewTemplate) {
      // 새 템플릿 생성 중이면 목록으로 바로 이동
      handleBackToList();
    } else if (isEditing) {
      // 기존 템플릿 편집 중이면 상세 화면으로 이동
      setIsEditing(false);
    } else {
      // 상세 화면에서는 목록으로 이동
      handleBackToList();
    }
  };

  // 로딩 화면 표시
  if (isGenerating) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white rounded-lg">
          <AiLoading message="AI가 답변을 생성하고 있습니다..."/>
      </div>
    );
  }

  // 선택된 템플릿이 있으면 편집 또는 상세 화면 표시
  if (selectedTemplateId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4 px-6 pt-6">
          <button 
            onClick={handleBackButtonClick}
            className="text-[#2D95CE] flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <Typography variant="body" className="text-[#2D95CE]">
              {isEditing ? 
                (isAddingNewTemplate ? "템플릿 목록으로 돌아가기" : "템플릿 상세로 돌아가기") : 
                "템플릿 목록으로 돌아가기"}
            </Typography>
          </button>
        </div>
        <div className="flex-1">
          {isEditing ? 
            <AiTemplateEdit 
              setIsGenerating={setIsGenerating} 
            /> : 
            <AiTemplateDetail 
            onApplyTemplate={onApplyTemplate}
            onCloseAssistant={onCloseAssistant}
            />
          }
        </div>
      </div>
    );
  }
          
  return (
    <div className="flex flex-col">
      <div className="p-6">
        {/* 상단 안내 메시지 */}
        <div className="bg-white rounded-lg p-3 mb-6 text-center border max-w-xs mx-auto">
          <Typography variant="body" color="primary" className="text-[#2D95CE]">
            원하시는 템플릿의 메일을 작성해 드립니다
          </Typography>
        </div>
        
        {/* 새 템플릿 추가 버튼 */}
        <AiTemplateAdd onClick={handleAddTemplate} />
        
        {/* 로딩 상태 표시 */}
        {isLoading && (
          <div className="text-center py-4">
            <Typography variant="body">템플릿 목록을 불러오는 중...</Typography>
          </div>
        )}
        
        {/* 에러 상태 표시 */}
        {isError && (
          <div className="text-center py-4 text-red-500">
            <Typography variant="body">템플릿 목록을 불러오는데 실패했습니다.</Typography>
          </div>
        )}
        
        {/* 템플릿 목록 */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {templates.map(template => (
              <AiTemplateCell
                key={template.id}
                title={template.title}
                onClick={() => handleSelectTemplate(template.id)}
                onDelete={() => handleDeleteTemplate(template.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTemplateList;
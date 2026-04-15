import React, { useEffect, useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import AiTemplateItem from '../molecules/aiTemplateItem';
import AiTemplateItemAdd from '../molecules/aiTemplateItemAdd';
import { useAiStore } from '../../stores/useAiStore';
import { useEmailTemplate, useUpdateEmailTemplate, useCreateEmailTemplate } from '../../hooks/useAiMail';
import { EmailTemplateRequest } from '../../types/aiMail';
import { showToast } from '@/shared/components/atoms/toast';

interface TemplateField {
  id: string;
  label: string;
  value: string;
}

interface AiTemplateEditProps {
  setIsGenerating: (isGenerating: boolean) => void;
}

// 입력 제한 상수
const MAX_TITLE_LENGTH = 20;
const MAX_FIELD_LABEL_LENGTH = 10;
const MAX_FIELD_VALUE_LENGTH = 20;
const MAX_PROMPT_LENGTH = 100;

const AiTemplateEdit: React.FC<AiTemplateEditProps> = ({ setIsGenerating }) => {
  const { selectedTemplateId, isAddingNewTemplate, setIsEditing, selectTemplate } = useAiStore();
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [promptCharCount, setPromptCharCount] = useState(0);

  // 템플릿 ID를 숫자로 변환
  const templateId = selectedTemplateId && !isAddingNewTemplate ? parseInt(selectedTemplateId) : 0;
  
  // API에서 템플릿 상세 정보 가져오기
  const { data: template, isLoading } = useEmailTemplate(templateId);
  
  // 템플릿 생성/수정 뮤테이션
  const createTemplateMutation = useCreateEmailTemplate();
  const updateTemplateMutation = useUpdateEmailTemplate();


  // 템플릿 데이터 로드
  useEffect(() => {
    if (template && !isAddingNewTemplate) {
      // 제한된 길이로 설정
      setTitle(template.title?.slice(0, MAX_TITLE_LENGTH) || '');
      setPrompt(template.userPrompt?.slice(0, MAX_PROMPT_LENGTH) || '');
      setPromptCharCount(template.userPrompt?.length || 0);
      
      // 템플릿 필드 변환
      if (template.fields && template.fields.length > 0) {
        const convertedFields = template.fields.map((field, index) => ({
          id: field.id || `field-${index}`,
          label: field.fieldName.slice(0, MAX_FIELD_LABEL_LENGTH),
          value: field.fieldValue.slice(0, MAX_FIELD_VALUE_LENGTH)
        }));
        setFields(convertedFields);
      }
    }
  }, [template, isAddingNewTemplate]);

  // 문자열이 공백이나 특수문자만 포함하는지 확인
  const isEmptyOrWhitespace = (str: string) => {
    return !str.trim();
  };

  // 필드에 유효한 내용이 하나라도 있는지 확인
  const hasValidFieldContent = () => {
    return fields.some(field => !isEmptyOrWhitespace(field.label) && !isEmptyOrWhitespace(field.value));
  };

  const handleAddField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: '',
      value: ''
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id: string, key: 'label' | 'value', value: string) => {
    // 필드 라벨과 값의 길이 제한
    const maxLength = key === 'label' ? MAX_FIELD_LABEL_LENGTH : MAX_FIELD_VALUE_LENGTH;
    const limitedValue = value.slice(0, maxLength);
    
    setFields(fields.map(field => 
      field.id === id ? { ...field, [key]: limitedValue } : field
    ));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 제목 길이 제한
    const limitedTitle = e.target.value.slice(0, MAX_TITLE_LENGTH);
    setTitle(limitedTitle);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 프롬프트 길이 제한
    const limitedPrompt = e.target.value.slice(0, MAX_PROMPT_LENGTH);
    setPrompt(limitedPrompt);
    setPromptCharCount(limitedPrompt.length);
  };

  const handleGenerateAiResponse = async () => {
    // 필드가 없는 경우
    if (fields.length === 0) {
      showToast('필드를 하나 이상 추가해주세요.', 'warning');
      return;
    }

    // 제목이 비어있거나 공백만 있는 경우
    if (isEmptyOrWhitespace(title)) {
      showToast('제목을 입력해주세요.', 'warning');
      return;
    }

    // 필드에 유효한 내용이 없는 경우
    if (!hasValidFieldContent()) {
      showToast('최소한 하나의 필드에는 내용을 입력해주세요.', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      // 템플릿 데이터 준비
      const templateData: EmailTemplateRequest = {
        title,
        fields: fields.map(field => ({
          fieldName: field.label,
          fieldValue: field.value
        })),
        userPrompt: prompt
      };

      // 새 템플릿 생성 또는 기존 템플릿 업데이트
      if (isAddingNewTemplate) {
        const response = await createTemplateMutation.mutateAsync(templateData);
        console.log('생성된 템플릿 응답:', response);
        
        // 응답에서 ID 추출 (응답 구조에 따라 조정 필요)
        if (response && response.id) {
          // 새로 생성된 템플릿의 ID로 선택 상태 업데이트
          selectTemplate(response.id.toString());
          showToast('템플릿이 성공적으로 생성되었습니다.', 'success');
        }
      } else {
        await updateTemplateMutation.mutateAsync({ id: templateId, template: templateData });
        showToast('템플릿이 성공적으로 업데이트되었습니다.', 'success');
      }
    
      // 편집 모드 종료
      setTimeout(() => {
        setIsGenerating(false);
        setIsEditing(false);
      }, 500);        
    } catch (error) {
      console.error('AI 응답 생성 실패:', error);
      showToast('AI 응답 생성에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#E1F3FD] p-6 rounded-lg h-full flex items-center justify-center">
        <Typography variant="body">템플릿 정보를 불러오는 중...</Typography>
      </div>
    );
  }

  return (
    <div className="bg-[#E1F3FD] p-6 rounded-lg h-full flex flex-col">
      {/* 템플릿 제목 */}
      <div className="mb-6">
        <Typography variant="titleSmall" className="mb-2">
          제목
        </Typography>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="템플릿 제목을 입력하세요"
          className="w-full p-2 border border-gray-300 rounded-md font-pretendard font-light text-sm"
          maxLength={MAX_TITLE_LENGTH}
        />
      </div>
      
      {/* 템플릿 필드 */}
      <div className="mb-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="titleSmall">
            중요 정보
          </Typography>
          <button
            onClick={handleAddField}
            className="text-blue-500 text-sm font-pretendard"
          >
            + 필드 추가
          </button>
        </div>
        
        {fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map(field => (
              <AiTemplateItem
                key={field.id}
                label={field.label}
                value={field.value}
                onChange={(value) => handleFieldChange(field.id, 'value', value)}
                onLabelChange={(value) => handleFieldChange(field.id, 'label', value)}
                onDelete={() => handleRemoveField(field.id)}
                maxLabelLength={MAX_FIELD_LABEL_LENGTH}
                maxValueLength={MAX_FIELD_VALUE_LENGTH}
              />
            ))}
          </div>
        ) : (
          <AiTemplateItemAdd onClick={handleAddField} />
        )}
      </div>
      
      {/* 프롬프트 입력창 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="titleSmall">
            생성 요청사항
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            {promptCharCount}/{MAX_PROMPT_LENGTH}
          </Typography>
        </div>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="AI에게 특별한 요청사항이 있다면 입력해주세요.
(예: 공손한 어투로 작성해줘, 두괄식으로 작성해줘 등)"
          className="w-full p-2 border border-gray-300 rounded-md min-h-[100px] resize-none font-pretendard font-light text-sm"
          maxLength={MAX_PROMPT_LENGTH}
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateAiResponse}
          className="flex items-center justify-center px-4 py-2 rounded-md text-white font-light transition-colors duration-200 hover:opacity-80 font-pretendard"
          style={{
            background: 'linear-gradient(90deg, #62DDFF 0%, #9D44CA 100%)',
            width: '150px',
            height: '40px',
            fontSize: '13px'
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path 
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
              fill="white"
            />
          </svg>
          AI 답변 생성하기
        </button>
      </div>
    </div>
  );
};

export default AiTemplateEdit;
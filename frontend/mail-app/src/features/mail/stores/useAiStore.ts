import { create } from 'zustand';

interface AiState {
  // AI 어시스턴트 상태
  isAiAssistantOpen: boolean;
  
  // AI 분석 결과 및 상태
  isAnalyzing: boolean;
  analysisResult: string | null;
  
  // AI 번역 상태
  isTranslating: boolean;
  translatedContent: string | null;
  
  // 템플릿 관련 상태
  selectedTemplateId: string | null;
  isAddingNewTemplate: boolean;
  isEditing: boolean;
  isOpen: boolean;

  // 액션
  openAiAssistant: () => void;
  closeAiAssistant: () => void;
  startAnalysis: () => void;
  setAnalysisResult: (result: string) => void;
  clearAnalysisResult: () => void;
  startTranslation: () => void;
  setTranslatedContent: (content: string) => void;
  clearTranslatedContent: () => void;
  selectTemplate: (id: string) => void;
  clearSelectedTemplate: () => void;
  setAddingNewTemplate: (isAdding: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useAiStore = create<AiState>((set) => ({
    // 초기 상태
    isAiAssistantOpen: false,
    isAnalyzing: false,
    analysisResult: null,
    isTranslating: false,
    translatedContent: null,
    isAddingNewTemplate: false,
    isOpen: false,

    // 템플릿 초기 상태
    selectedTemplateId: null,
    isEditing: false,

    // 액션
    openAiAssistant: () => set({ isAiAssistantOpen: true }),
    closeAiAssistant: () => set({ isAiAssistantOpen: false }),
    
    startAnalysis: () => set({ isAnalyzing: true }),
    setAnalysisResult: (result) => set({ analysisResult: result, isAnalyzing: false }),
    clearAnalysisResult: () => set({ analysisResult: null }),
    
    startTranslation: () => set({ isTranslating: true }),
    setTranslatedContent: (content) => set({ translatedContent: content, isTranslating: false }),
    clearTranslatedContent: () => set({ translatedContent: null }),
    
    // 템플릿 관련 액션
    selectTemplate: (id) => set({ selectedTemplateId: id }),
    clearSelectedTemplate: () => set({ selectedTemplateId: null }),
    setAddingNewTemplate: (isAdding: boolean) => set({ isAddingNewTemplate: isAdding }),
    setIsEditing: (isEditing: boolean) => set({ isEditing }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),

}));
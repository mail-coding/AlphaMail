import { create } from 'zustand';
import { ChatMessage, ChatState } from '../types/chat';
import { chatService } from '../services/chatService';

interface ChatStore extends ChatState {
  sendMessage: (content: string, userId: string) => Promise<void>;
  clearMessages: () => void;
  removeMessage: (index: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // 사용자 메시지 추가
      const userMessage: ChatMessage = {
        reply: content,
        ids: [],
        type: 'text',
        isUser: true
      };

      set((state) => ({
        messages: [...state.messages, userMessage],
      }));

      // 챗봇 응답 받기
      console.log('useChatStore - API 요청 전:', { content, userId });
      const botResponse = await chatService.sendMessage(content, userId);
      console.log('useChatStore - API 응답 받음:', botResponse);
      
      const botMessage: ChatMessage = {
        reply: botResponse.reply,
        ids: botResponse.ids,
        type: botResponse.type,
        content: botResponse.content,
        isUser: false
      };
      console.log('useChatStore - 저장할 메시지:', botMessage);

      set((state) => ({
        messages: [...state.messages, botMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('useChatStore - 에러 발생:', error);
      set({
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        isLoading: false,
      });
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },

  removeMessage: (index: number) => {
    set((state) => ({
      messages: state.messages.filter((_, i) => i !== index)
    }));
  }
})); 
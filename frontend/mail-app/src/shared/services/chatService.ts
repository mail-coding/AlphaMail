import { ChatMessage } from '../types/chat';
import { api } from '@/shared/lib/axiosInstance';

class ChatService {
  private static instance: ChatService;

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(message: string, userId: string): Promise<ChatMessage> {
    try {
      console.log('chatService - 요청 데이터:', { message, userId });

      const response = await api.post('/api/chatbot/message', {
        message,
        userId,
      });
      const data = response.data;
      
      console.log('chatService - API 응답 데이터:', data);
      console.log('chatService - content 필드 확인:', data.content);
      
      const chatMessage: ChatMessage = {
        reply: data.reply,
        ids: data.ids,
        type: data.type,
        isUser: false,
        content: data.content
      };
      
      console.log('chatService - 반환할 메시지:', chatMessage);
      
      return chatMessage;
    } catch (error) {
      console.error('챗봇 메시지 전송 중 오류:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance(); 
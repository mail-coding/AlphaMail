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
      const response = await api.post('/api/chatbot/message', {
        message,
        userId,
      });
      const data = response.data;
      
      return {
        reply: data.reply,
        ids: data.ids,
        type: data.type,
        isUser: false,
      };
    } catch (error) {
      console.error('챗봇 메시지 전송 중 오류:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance(); 
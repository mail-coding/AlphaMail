export interface ChatMessage {
  reply: string;
  ids: string[];
  type: string;
  isUser: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
} 
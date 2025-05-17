export type MessageType = 'quote' | 'purchaseOrder' | 'schedule' | 'tmp_schedule' | 'text';

export interface ChatMessage {
  reply: string;
  ids: string[];
  type: MessageType;
  isUser: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
} 
import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/chat';
import { useUser } from '@/features/auth/hooks/useUser';

const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
`;

const SendButton = styled.button`
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 15px;
  background-color: ${props => props.isUser ? '#007bff' : '#f0f0f0'};
  color: ${props => props.isUser ? 'white' : 'black'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LoadingIndicator = styled.div`
  padding: 10px;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 10px;
  color: #dc3545;
  text-align: center;
  background-color: #f8d7da;
  border-radius: 4px;
  margin: 5px 0;
`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage } = useChatStore();
  const { data: userInfo } = useUser();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (message.trim() && userInfo?.id) {
      await sendMessage(message.trim(), userInfo.id.toString());
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <ChatBotContainer>
      <ChatButton onClick={toggleChat}>
        {isOpen ? '×' : '💬'}
      </ChatButton>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>챗봇</ChatHeader>
          <ChatMessages>
            <MessageContainer>
              {messages.map((msg: ChatMessage, index: number) => (
                <MessageBubble key={index} isUser={msg.isUser}>
                  {msg.reply}
                </MessageBubble>
              ))}
              {isLoading && <LoadingIndicator>답변을 생성하는 중...</LoadingIndicator>}
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <div ref={messagesEndRef} />
            </MessageContainer>
          </ChatMessages>
          <ChatInput>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <SendButton onClick={handleSendMessage} disabled={isLoading}>
              전송
            </SendButton>
          </ChatInput>
        </ChatWindow>
      )}
    </ChatBotContainer>
  );
};

export default ChatBot; 
import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/chat';
import { useUser } from '@/features/auth/hooks/useUser';

const ChatBotContainer = styled.div<{ position: { x: number; y: number } }>`
  position: fixed;
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  z-index: 1000;
  transition: transform 0.1s ease-out;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 24px;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  user-select: none;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWindow = styled.div<{ 
  position: { x: number; y: number },
  windowPosition: { x: number; y: number }
}>`
  position: fixed;
  left: ${props => props.windowPosition.x}px;
  top: ${props => props.windowPosition.y}px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease-out;
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
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 80 });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage } = useChatStore();
  const { data: userInfo } = useUser();

  const calculateWindowPosition = (botX: number, botY: number) => {
    const windowWidth = 350;
    const windowHeight = 500;
    const margin = 20;
    let newX = botX;
    let newY = botY;

    // 화면 오른쪽에 가까운 경우
    if (botX > window.innerWidth / 2) {
      newX = botX - windowWidth - margin;
    } else {
      newX = botX + 60 + margin; // 버튼 너비 + 여백
    }

    // 화면 아래쪽에 가까운 경우
    if (botY > window.innerHeight / 2) {
      newY = botY - windowHeight - margin;
    } else {
      newY = botY + margin;
    }

    // 화면 경계 체크
    newX = Math.max(margin, Math.min(newX, window.innerWidth - windowWidth - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - windowHeight - margin));

    return { x: newX, y: newY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // 화면 경계 체크
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      };
      
      setPosition(newPosition);
      setWindowPosition(calculateWindowPosition(newPosition.x, newPosition.y));
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - startPosition.x, 2) + 
        Math.pow(e.clientY - startPosition.y, 2)
      );
      
      if (dragDistance < 5) {
        toggleChat();
      }
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, startPosition]);

  useEffect(() => {
    setWindowPosition(calculateWindowPosition(position.x, position.y));
  }, [position]);

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
    <ChatBotContainer position={position}>
      <ChatButton 
        onMouseDown={handleMouseDown}
        style={{ opacity: isDragging ? 0.8 : 1 }}
      >
        {isOpen ? '×' : '💬'}
      </ChatButton>
      {isOpen && (
        <ChatWindow position={position} windowPosition={windowPosition}>
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
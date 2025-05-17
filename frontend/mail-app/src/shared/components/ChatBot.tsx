import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/chat';
import { useUser } from '@/features/auth/hooks/useUser';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import AiLoading from '@/features/mail/components/organisms/aiLoading';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '@/features/work/hooks/useQuote';
import { useOrderDetail } from '@/features/work/hooks/useOrderDetail';
import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '@/features/schedule/services/scheduleService';

// 스타일 컴포넌트
const MessageCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #eee;
  font-weight: 500;
  color: #666;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

// 각 타입별 컴포넌트
const QuoteMessage = ({ id, reply }: { id: string; reply: string }) => {
  const navigate = useNavigate();
  const { data: quoteDetail } = useQuotes({ search: id });
  const quotes = quoteDetail?.contents || [];
  
  return (
    <MessageCard>
      <Typography variant="body" className="mb-2">{reply}</Typography>
      <Table>
        <thead>
          <tr>
            <Th>거래처</Th>
            <Th>품목</Th>
            <Th>금액</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <Tr key={quote.id}>
              <Td>{quote.clientName || '-'}</Td>
              <Td>{quote.productName || '-'}</Td>
              <Td>{quote.price?.toLocaleString() || '-'}원</Td>
              <Td>
                <Button 
                  size="small" 
                  variant="primary" 
                  onClick={() => navigate(`/work/quotes/${quote.id}`)}
                >
                  보기
                </Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </MessageCard>
  );
};

const PurchaseOrderMessage = ({ id, reply }: { id: string; reply: string }) => {
  const navigate = useNavigate();
  const { data: orderDetail } = useOrderDetail(parseInt(id));
  const products = orderDetail?.products || [];
  
  return (
    <MessageCard>
      <Typography variant="body" className="mb-2">{reply}</Typography>
      <Table>
        <thead>
          <tr>
            <Th>거래처</Th>
            <Th>납기일</Th>
            <Th>품목</Th>
            <Th>금액</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{orderDetail?.clientName || '-'}</Td>
              <Td>{orderDetail?.deliverAt ? new Date(orderDetail.deliverAt).toLocaleDateString() : '-'}</Td>
              <Td>{product.name || '-'}</Td>
              <Td>{product.amount?.toLocaleString() || '-'}원</Td>
              <Td>
                <Button 
                  size="small" 
                  variant="primary" 
                  onClick={() => navigate(`/work/orders/${id}`)}
                >
                  보기
                </Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </MessageCard>
  );
};

const formatDateTime = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
};

const ScheduleMessage = ({ id, reply }: { id: string; reply: string }) => {
  const navigate = useNavigate();
  const { data: scheduleDetail } = useQuery({
    queryKey: ['schedule', id],
    queryFn: () => scheduleService.getSchedulesForWeek(new Date()),
  });
  
  const schedules = scheduleDetail?.data || [];
  
  return (
    <MessageCard>
      <Typography variant="body" className="mb-2">{reply}</Typography>
      <Table>
        <thead>
          <tr>
            <Th>일정명</Th>
            <Th>시작</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <Tr key={schedule.id}>
              <Td>{schedule.name || '-'}</Td>
              <Td>{schedule.start_time ? formatDateTime(new Date(schedule.start_time)) : '-'}</Td>
              <Td>
                <Button 
                  size="small" 
                  variant="primary" 
                  onClick={() => navigate(`/schedule/${schedule.id}`)}
                >
                  보기
                </Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </MessageCard>
  );
};

const TmpScheduleMessage = ({ id, reply }: { id: string; reply: string }) => {
  const navigate = useNavigate();
  const { data: scheduleDetail } = useQuery({
    queryKey: ['schedule', id],
    queryFn: () => scheduleService.getSchedulesForWeek(new Date()),
  });
  
  const schedules = scheduleDetail?.data || [];
  
  return (
    <MessageCard>
      <Typography variant="body" className="mb-2">{reply}</Typography>
      <Table>
        <thead>
          <tr>
            <Th>일정명</Th>
            <Th>시작</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <Tr key={schedule.id}>
              <Td>{schedule.name || '-'}</Td>
              <Td>{schedule.start_time ? formatDateTime(new Date(schedule.start_time)) : '-'}</Td>
              <Td>
                <Button 
                  size="small" 
                  variant="primary" 
                  onClick={() => navigate(`/schedule/tmp/${schedule.id}`)}
                >
                  보기
                </Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </MessageCard>
  );
};

// 스타일 컴포넌트
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
  background: linear-gradient(to right, #62DDFF, #9D44CA);
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
  width: 500px;
  height: 500px;
  background-color: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease-out;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: linear-gradient(to right, #62DDFF, #9D44CA);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: white;
  scroll-behavior: smooth;
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  background-color: white;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: 18px;
  background-color: ${props => props.isUser ? 'white' : '#f5f5f5'};
  color: black;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  color: #dc3545;
  text-align: center;
  background-color: #f8d7da;
  border-radius: 8px;
  margin: 8px 0;
  font-size: 14px;
`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState(() => {
    const distance = window.innerHeight * 0.14;
    return {
      x: window.innerWidth - distance,
      y: window.innerHeight - distance
    };
  });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage } = useChatStore();
  const { data: userInfo } = useUser();

  const calculateWindowPosition = (botX: number, botY: number) => {
    const windowWidth = 500;
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const renderMessage = (msg: ChatMessage) => {
    if (msg.type === 'quote' && msg.ids[0]) {
      return <QuoteMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    if (msg.type === 'purchaseOrder' && msg.ids[0]) {
      return <PurchaseOrderMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    if (msg.type === 'schedule' && msg.ids[0]) {
      return <ScheduleMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    if (msg.type === 'tmp_schedule' && msg.ids[0]) {
      return <TmpScheduleMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    // 기본 텍스트 메시지
    return <MessageBubble isUser={msg.isUser}>{msg.reply}</MessageBubble>;
  };

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
          <ChatHeader>
            <Typography variant="titleMedium" bold className="text-white">
              AI 어시스턴트
            </Typography>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 absolute right-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </ChatHeader>
          <ChatMessages>
            <MessageContainer>
              {messages.map((msg: ChatMessage, index: number) => (
                <div key={index}>
                  {renderMessage(msg)}
                </div>
              ))}
              {isLoading && (
                <LoadingContainer>
                  <AiLoading />
                </LoadingContainer>
              )}
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
              size="medium"
              variant="default"
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              size="small"
              variant="primary"
            >
              전송
            </Button>
          </ChatInput>
        </ChatWindow>
      )}
    </ChatBotContainer>
  );
};

export default ChatBot; 
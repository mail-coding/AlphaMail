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
import { useOrderDetail } from '@/features/work/hooks/useOrderDetail';
import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '@/features/schedule/services/scheduleService';
import { Schedule } from '@/features/schedule/types/schedule';
import { useQuoteDetail } from '@/features/work/hooks/useQuoteDetail';

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
  const { data: quoteDetail } = useQuoteDetail(parseInt(id));
  const quotes = quoteDetail?.products || [];
  
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
              <Td>{quoteDetail?.clientName || '-'}</Td>
              <Td>{quote.name || '-'}</Td>
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

const TmpScheduleMessage = ({ reply, content }: { reply: string; content?: { name?: string; startTime?: string; endTime?: string | null; description?: string | null } }) => {
  const navigate = useNavigate();
  const [scheduleForm, setScheduleForm] = useState({
    name: content?.name || '',
    startTime: content?.startTime || '',
    endTime: content?.endTime || '',
    description: content?.description || ''
  });
  const [errors, setErrors] = useState<{
    name?: string;
    startTime?: string;
    endTime?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSchedule, setCreatedSchedule] = useState<Schedule | null>(null);
  const { messages, removeMessage } = useChatStore();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!scheduleForm.name.trim()) {
      newErrors.name = '일정명을 입력해주세요.';
    }
    if (!scheduleForm.startTime) {
      newErrors.startTime = '시작 시간을 선택해주세요.';
    }
    if (scheduleForm.endTime && new Date(scheduleForm.endTime) < new Date(scheduleForm.startTime)) {
      newErrors.endTime = '종료 시간은 시작 시간보다 이후여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await scheduleService.createSchedule({
        name: scheduleForm.name,
        start_time: new Date(scheduleForm.startTime),
        end_time: scheduleForm.endTime ? new Date(scheduleForm.endTime) : new Date(scheduleForm.startTime),
        description: scheduleForm.description || '',
        is_done: false,
        created_at: new Date()
      });
      
      if (response) {
        setCreatedSchedule(response);
      }
    } catch (error) {
      console.error('일정 생성 실패:', error);
      setErrors(prev => ({
        ...prev,
        submit: '일정 생성에 실패했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const messageIndex = messages.findIndex(msg => msg.type === 'tmp_schedule');
    if (messageIndex !== -1) {
      removeMessage(messageIndex);
    }
  };

  if (createdSchedule) {
    return (
      <MessageCard>
        <Typography variant="body" className="mb-4">일정이 성공적으로 추가되었습니다.</Typography>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/schedule')}
            variant="primary"
            size="large"
          >
            일정 페이지로 이동
          </Button>
        </div>
      </MessageCard>
    );
  }

  return (
    <MessageCard>
      <Typography variant="body" className="mb-2">{reply}</Typography>
      <div className="space-y-4">
        <div>
          <Typography variant="caption" className="block mb-1">일정명 <span className="text-red-500">*</span></Typography>
          <Input
            type="text"
            value={scheduleForm.name}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="일정명을 입력하세요"
            size="small"
            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <Typography variant="caption" color="text-red-500">{errors.name}</Typography>
          )}
        </div>
        <div>
          <Typography variant="caption" className="block mb-1">시작 시간 <span className="text-red-500">*</span></Typography>
          <Input
            type="datetime-local"
            value={scheduleForm.startTime}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
            size="small"
            className={`w-full ${errors.startTime ? 'border-red-500' : ''}`}
          />
          {errors.startTime && (
            <Typography variant="caption" color="text-red-500">{errors.startTime}</Typography>
          )}
        </div>
        <div>
          <Typography variant="caption" className="block mb-1">종료 시간 (선택사항)</Typography>
          <Input
            type="datetime-local"
            value={scheduleForm.endTime}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
            size="small"
            className={`w-full ${errors.endTime ? 'border-red-500' : ''}`}
          />
          {errors.endTime && (
            <Typography variant="caption" color="text-red-500">{errors.endTime}</Typography>
          )}
        </div>
        <div>
          <Typography variant="caption" className="block mb-1">설명 (선택사항)</Typography>
          <textarea
            value={scheduleForm.description}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="설명을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="small"
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="small"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리중...' : '일정 추가'}
          </Button>
        </div>
        {errors.submit && (
          <Typography variant="caption" color="text-red-500" className="block text-center">
            {errors.submit}
          </Typography>
        )}
      </div>
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

  // 메시지 변경 감지
  useEffect(() => {
    console.log('ChatBot - 현재 메시지 목록:', messages);
  }, [messages]);

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
      console.log('ChatBot - 메시지 전송:', message.trim());
      setMessage('');
      await sendMessage(message.trim(), userInfo.id.toString());
      // 메시지 전송 후 스크롤
      setTimeout(() => {
        scrollToBottom();
      }, 100);
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
    console.log('ChatBot - 렌더링할 메시지:', {
      type: msg.type,
      reply: msg.reply,
      ids: msg.ids,
      content: msg.content,
      isUser: msg.isUser
    });
    
    if (msg.type === 'quote' && msg.ids[0]) {
      return <QuoteMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    if (msg.type === 'purchaseOrder' && msg.ids[0]) {
      return <PurchaseOrderMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    if (msg.type === 'schedule' && msg.ids[0]) {
      return <ScheduleMessage id={msg.ids[0]} reply={msg.reply} />;
    }
    if (msg.type === 'tmp_schedule') {
      console.log('ChatBot - tmp_schedule 메시지 상세:', {
        reply: msg.reply,
        content: msg.content
      });
      return <TmpScheduleMessage reply={msg.reply} content={msg.content} />;
    }
    // 기본 텍스트 메시지
    return <MessageBubble isUser={msg.isUser}>{msg.reply}</MessageBubble>;
  };

  return (
    <ChatBotContainer position={position}>
      <ChatButton 
        onMouseDown={handleMouseDown}
      >
      <img src="/chatbot.png" alt="ChatBot Icon" style={{ width: '100%', height: '100%' }} />
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
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore: If you see a type error for '@emotion/styled', install @types/emotion__styled for type safety
import styled from '@emotion/styled';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/chat';
import { useUser } from '@/features/auth/hooks/useUser';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { useNavigate } from 'react-router-dom';
import { useOrderDetail } from '@/features/work/hooks/useOrderDetail';
import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '@/features/schedule/services/scheduleService';
import { Schedule } from '@/features/schedule/types/schedule';
import { useQuoteDetail } from '@/features/work/hooks/useQuoteDetail';

// 스타일 컴포넌트
const MessageCard = styled.div`
  background-color:rgb(255, 255, 255)
  border-radius: 10px;
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
  font-weight: 500;
  padding: 8px;
  color: #666;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

function formatUTCToKSTLocalInputString(utcISOString: string): string {
  const date = new Date(utcISOString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간 보정
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  const hours = String(kstDate.getHours()).padStart(2, '0');
  const minutes = String(kstDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// 각 타입별 컴포넌트
const QuoteMessage = ({ id, reply }: { id: string; reply: string }) => {
  const navigate = useNavigate();
  const { data: quoteDetail } = useQuoteDetail(parseInt(id));
  const quotes = quoteDetail?.products || [];
  
  return (
    <>
      <MessageCard>
        <Typography variant="titleSmall" className="mb-2">{reply}</Typography>
      </MessageCard>
      <MessageCard>
        <Table>
          <thead>
            <tr>
              <Th><Typography variant="titleSmall">거래처</Typography></Th>
              <Th><Typography variant="titleSmall">품목</Typography></Th>
              <Th><Typography variant="titleSmall">금액</Typography></Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <Tr key={quote.id}>
                <Td><Typography variant="titleSmall">{quoteDetail?.clientName || '-'}</Typography></Td>
                <Td><Typography variant="titleSmall">{quote.name || '-'}</Typography></Td>
                <Td><Typography variant="titleSmall">{quote.price?.toLocaleString() || '-'}원</Typography></Td>
                <Td>
                  <Button 
                    size="small" 
                    variant="primary"
                    className="flex-1"
                    style={{ background: '#73A2FC', color: '#fff', border: 'none', borderRadius: 5 }}
                    onClick={() => navigate(`/work/quotes/${quote.id}`)}
                  >
                    <Typography variant="titleSmall" className="text-white">보기</Typography>
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </MessageCard>
    </>
  );
};

const PurchaseOrderMessage = ({ id, reply }: { id: string; reply: string }) => {
  const navigate = useNavigate();
  const { data: orderDetail } = useOrderDetail(parseInt(id));
  const products = orderDetail?.products || [];
  
  return (
    <>
      <MessageCard>
        <Typography variant="titleSmall" className="mb-2">{reply}</Typography>
      </MessageCard>
      <MessageCard>
        <Table>
          <thead>
            <tr>
              <Th><Typography variant="titleSmall">거래처</Typography></Th>
              <Th><Typography variant="titleSmall">납기일</Typography></Th>
              <Th><Typography variant="titleSmall">품목</Typography></Th>
              <Th><Typography variant="titleSmall">금액</Typography></Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td><Typography variant="titleSmall">{orderDetail?.clientName || '-'}</Typography></Td>
                <Td><Typography variant="titleSmall">{orderDetail?.deliverAt ? new Date(orderDetail.deliverAt).toLocaleDateString() : '-'}</Typography></Td>
                <Td><Typography variant="titleSmall">{product.name || '-'}</Typography></Td>
                <Td><Typography variant="titleSmall">{product.amount?.toLocaleString() || '-'}원</Typography></Td>
                <Td>
                  <Button 
                    size="small" 
                    variant="primary" 
                    className="flex-1"
                    style={{ background: '#73A2FC', color: '#fff', border: 'none', borderRadius: 5 }}
                    onClick={() => navigate(`/work/orders/${id}`)}
                  >
                    <Typography variant="titleSmall" className="text-white">보기</Typography>
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </MessageCard>
    </>
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
    <>
      <MessageBubble isUser={false}>
    
        <Typography variant="titleSmall"  className="text-[#528BF9]">{reply.split('.').map((line, idx) => (<React.Fragment key={idx}>{line}{idx !== reply.split('.').length - 1 && <br />}</React.Fragment>))}</Typography>

      </MessageBubble>
      <MessageBubble isUser={false}>
        
        <Table>
          <thead>
            <tr>
              <Th><Typography variant="titleSmall">일정명</Typography></Th>
              <Th><Typography variant="titleSmall">시작</Typography></Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <Tr key={schedule.id}>
                <Td><Typography variant="titleSmall" >{schedule.name || '-'}</Typography></Td>
    
                <Td><Typography variant="titleSmall">{schedule.start_time ? formatDateTime(new Date(schedule.start_time)) : '-'}</Typography></Td>
                <Td>
                  <Button 
                    size="small" 
                    variant="primary" 
                    className="flex-1"
                    style={{ background: '#73A2FC', color: '#fff', border: 'none', borderRadius: 5 }}
                    onClick={() => navigate(`/schedule/${schedule.id}`)}
                  >
                    <Typography variant="titleSmall" className="text-white">보기</Typography>
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </MessageBubble>
    </>
  );
};

const TmpScheduleMessage = ({ content }: { reply: string; content?: { name?: string; startTime?: string; endTime?: string | null; description?: string | null } }) => {
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
    if (scheduleForm.endTime && new Date(ensureZ(scheduleForm.endTime)) < new Date(ensureZ(scheduleForm.startTime))) {
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
        start_time: new Date(new Date(scheduleForm.startTime).getTime() + 9 * 60 * 60 * 1000),
        end_time: scheduleForm.endTime 
          ? new Date(new Date(scheduleForm.endTime).getTime() + 9 * 60 * 60 * 1000) 
          : new Date(new Date(scheduleForm.startTime).getTime() + 9 * 60 * 60 * 1000),
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
      <MessageCard style={{ background: '#F7F7F7' }}>
        <Typography variant="titleSmall" className="mb-4">일정이 성공적으로 추가되었습니다.</Typography>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/schedule')}
            variant="primary"
            className="flex-1"
            style={{ background: '#73A2FC', color: '#fff', border: 'none', borderRadius: 5 }}
            size="large"
          >
            <Typography variant="titleSmall" className="text-white">일정 페이지로 이동</Typography>
          </Button>
        </div>
      </MessageCard>
    );
  }

  return (
    <MessageCard style={{ background: '#F7F7F7' }}>
      <div className="space-y-4">
        <div>
          
          <Typography variant="titleSmall" className="block mb-1">일정명 <span className="text-red-500">*</span></Typography>
          <Input
  type="text"
  value={scheduleForm.name}
  onChange={(e) =>
    setScheduleForm((prev) => ({ ...prev, name: e.target.value }))
  }
  placeholder="일정명을 입력하세요"
  className={`w-full text-black ${errors.name ? 'border-red-500' : ''}`}
/>
          {errors.name && (
            <Typography variant="caption" color="text-red-500">{errors.name}</Typography>
          )}
        </div>
        <div>
          <Typography variant="titleSmall" className="block mb-1">시작 시간 <span className="text-red-500">*</span></Typography>
        
          <Input
            type="datetime-local"
            value={formatUTCToKSTLocalInputString(scheduleForm.startTime)}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: new Date(new Date(e.target.value).getTime() - 9 * 60 * 60 * 1000).toISOString() }))}
         
            className={`w-full text-black${errors.startTime ? 'border-red-500' : ''}`}
          />
          {errors.startTime && (
            <Typography variant="titleSmall" color="text-red-500">{errors.startTime}</Typography>
          )}
        </div>
        <div>
          <Typography variant="titleSmall" className="block mb-1">종료 시간 (선택사항)</Typography>
          <Input
            type="datetime-local"
            value={formatUTCToKSTLocalInputString(scheduleForm.endTime)}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: new Date(new Date(e.target.value).getTime() - 9 * 60 * 60 * 1000).toISOString() }))}
           
            className={`w-full text-black ${errors.endTime ? 'border-red-500' : ''}`}
          />
          {errors.endTime && (
            <Typography variant="caption" color="text-red-500">{errors.endTime}</Typography>
          )}
        </div>
        <div>
          <Typography variant="titleSmall" className="block mb-1">설명 (선택사항)</Typography>
          <textarea
            value={scheduleForm.description}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="설명을 입력하세요"
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] font-pretendard"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="small"
            className="flex-1"
            style={{ background: '#fff', color: '#fff', border: 'none', borderRadius: 5 }}
          >
            <Typography variant="titleSmall">취소</Typography>
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="small"
            className="flex-1"
            style={{ background: '#73A2FC', color: '#fff', border: 'none', borderRadius: 5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Typography variant="titleSmall" className="text-white">처리중...</Typography> : <Typography variant="titleSmall" className="text-white">일정 추가</Typography>}
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
  position: { x: number; y: number };
  windowPosition: { x: number; y: number };
}>`
  position: fixed;
  left: ${props => props.windowPosition.x}px;
  top: ${props => props.windowPosition.y}px;
  width: 450px;
  height: 600px;
  background-color:  rgba(255, 255, 255, 0.2);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease-out;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: linear-gradient(to right, #62DDFF,rgb(68, 134, 233));
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color:rgb(245, 245, 245);
  scroll-behavior: smooth;
`;

const ChatInput = styled.div`
  padding: 3px 20px;
  background:rgb(252, 252, 252);
  border: 1px solid #E0E0E0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatInputBox = styled.div`
  padding: 10px 20px;
  background-color:rgb(247, 247, 247);
  gap: 10px;
`;

const ChatInputField = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  color: #222;
  padding: 10px 0;
  resize: none;
  min-height: 36px;
  max-height: 200px;
  overflow-y: auto;
`;

const SendButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  width: 30x;
  height: 30px;
  cursor: pointer;
  transition: background 0.1s;
  &:hover:enabled {
    background:rgb(255, 255, 255);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessageBubble = styled.div<{ isUser: boolean }>((props: { isUser: boolean }) => `
  max-width: 80%;
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: 10px;
  background-color: ${props.isUser ? '#528BF9' : '#ffffff'};
  color: ${props.isUser ? '#ffffff' : '#528BF9'};
  align-self: ${props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: ${props.isUser ? 'left' : 'left'};
  display: inline-block;
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
`);

const MessageRow = styled.div<{ isUser: boolean }>((props: { isUser: boolean }) => `
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: ${props.isUser ? 'flex-end' : 'flex-start'};
  gap: 8px;
`);

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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

// Helper to ensure date string has 'Z' for UTC
function ensureZ(dateStr: string): string {
  if (!dateStr) return dateStr;
  if (typeof dateStr === 'string' && dateStr.length > 10 && !dateStr.endsWith('Z')) {
    return dateStr + 'Z';
  }
  return dateStr;
}

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
  const { messages, isLoading, error, sendMessage, clearMessages, addBotMessage } = useChatStore();
  const { data: userInfo } = useUser();

  // 메시지 변경 감지
  useEffect(() => {
    console.log('ChatBot - 현재 메시지 목록:', messages);
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(`안녕하세요! 😊\n저는 일정과 업무 문서를 도와드리는 AI 비서입니다. 아래와 같은 기능을 이용하실 수 있어요:
\n📅 1. 일정 등록
- "내일 오후 2시에 회의 잡아줘"
- "5월 20일 10시에 김부장님이랑 미팅 추가해줘"

🔍 2. 일정 조회
- "이번 주 일정 뭐 있어?"
- "오늘 스케줄 알려줘"

📦 3. 발주서 검색
- "지난주에 등록한 발주서 보여줘"
- "5월 1일 발주 내용 알려줘"

📄 4. 견적서 검색
- "최근 견적서 정리해줘"
- "어제 받은 견적서 뭐였지?"

무엇을 도와드릴까요?`);
    }
  }, [isOpen]);

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
    if (isOpen) {
      clearMessages();
    }
    setIsOpen(!isOpen);
  };

  const getTimezoneOffsetString = () => {
    const offset = new Date().getTimezoneOffset();
    const absOffset = Math.abs(offset);
    const sign = offset <= 0 ? '+' : '-';
    const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
    const minutes = String(absOffset % 60).padStart(2, '0');
    return `${sign}${hours}:${minutes}`;
  };

  const handleSendMessage = async () => {
    if (message.trim() && userInfo?.id) {
      console.log('ChatBot - 메시지 전송:', message.trim());
      setMessage('');
      const timezone = getTimezoneOffsetString();
      await sendMessage(message.trim(), userInfo.id.toString(), timezone);
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
    if (msg.type === 'quote' && msg.ids[0]) {
      return (
        <MessageRow isUser={false}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <img src="/chatbot.png" alt="Chatbot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <div style={{ width: '100%' }}>
            <QuoteMessage id={msg.ids[0]} reply={msg.reply} />
          </div>
        </MessageRow>
      );
    }
    if (msg.type === 'purchaseOrder' && msg.ids[0]) {
      return (
        <MessageRow isUser={false}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <img src="/chatbot.png" alt="Chatbot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <div style={{ width: '100%' }}>
            <PurchaseOrderMessage id={msg.ids[0]} reply={msg.reply} />
          </div>
        </MessageRow>
      );
    }
    if (msg.type === 'schedule' && msg.ids[0]) {
      return (
        <MessageRow isUser={false}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <img src="/chatbot.png" alt="Chatbot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <div style={{ width: '100%' }}>
            
            <ScheduleMessage id={msg.ids[0]} reply={msg.reply} />
          </div>
        </MessageRow>
      );
    }
    if (msg.type === 'tmp_schedule') {
      return (
        <MessageRow isUser={false}>
         
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <img src="/chatbot.png" alt="Chatbot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <div style={{ width: '100%' }}>
          <MessageBubble isUser={false}>
          <Typography variant="titleSmall" className="text-[#528BF9]">{msg.reply.split('\n').map((line, idx) => (<React.Fragment key={idx}>{line}{idx !== msg.reply.split('\n').length - 1 && <br />}</React.Fragment>))}

            <TmpScheduleMessage 
            
            reply={msg.reply} content={msg.content} />
          </Typography>
          </MessageBubble>
          </div>
        </MessageRow>
      );
    }
    // 기본 텍스트 메시지
    if (!msg.isUser) {
      return (
        <MessageRow isUser={false}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <img src="/chatbot.png" alt="Chatbot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          </div>
          <MessageBubble isUser={false}>
            <Typography variant="titleSmall" className="text-[#528BF9]">{msg.reply.split('\n').map((line, idx) => (<React.Fragment key={idx}>{line}{idx !== msg.reply.split('\n').length - 1 && <br />}</React.Fragment>))}</Typography>
          </MessageBubble>
        </MessageRow>
      );
    }
    // 사용자 메시지(오른쪽)
    return (
      <MessageRow isUser={true}>
        <MessageBubble isUser={true}>
          <Typography variant="titleSmall"  className="text-white">{msg.reply}</Typography>
        </MessageBubble>
      </MessageRow>
    );
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/chaticon.png" alt="ChatBot Icon" style={{ width: 25, height: 25, objectFit: 'contain' }} />
              <Typography variant="titleSmall" className="text-white ml-1">
              Chat Alpha
              </Typography>
            </div>
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
                <MessageRow isUser={false}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
                    <img src="/chatbot.png" alt="Chatbot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  </div>
                  <MessageBubble isUser={false}>
                    <img src="/chat-loading.gif" alt="로딩" style={{ width: 32, height: 32 }} />
                  </MessageBubble>
                </MessageRow>
              )}
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <div ref={messagesEndRef} />
            </MessageContainer>
          </ChatMessages>
          <ChatInputBox>
          <ChatInput>
            <ChatInputField
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              rows={1}
            />
            <SendButton onClick={handleSendMessage} disabled={isLoading}>
              <img src="/sendicon.png" alt="전송" style={{ width: 25, height: 25, objectFit: 'contain' }} />
            </SendButton>
          </ChatInput>
          </ChatInputBox>
        </ChatWindow>
      )}
    </ChatBotContainer>
  );
};

export default ChatBot; 
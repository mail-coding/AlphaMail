import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MailWriteHeader } from '../organisms/mailWriteHeader';
import { MailWriteForm } from '../organisms/mailWriteForm';
import { useMail } from '../../hooks/useMail';
import { RecentEmailItem, SendMailRequest } from '../../types/mail';
import { Spinner } from '@/shared/components/atoms/spinner';
import { mailService } from '../../services/mailService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useMailStore } from '../../stores/useMailStore';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import AiPageTemplate from './aiPageTemplate';
import { useAiStore } from '../../stores/useAiStore';
import { useUser } from '@/features/auth/hooks/useUser'; // useUser 훅 임포트

const FONT_OPTIONS = [
  { value: 'pretendard', label: '프리텐다드' },
  { value: 'notosans', label: '노토 산스' },
  { value: 'nanumgothic', label: '나눔 고딕' },
  { value: 'nanummyeongjo', label: '나눔 명조' },
  { value: 'spoqa', label: '스포카 한 산스' },
  { value: 'gowundodum', label: '고운 도둠' },
  { value: 'gowunbatang', label: '고운 바탕' },
  { value: 'ibmplex', label: 'IBM Plex Sans' }
];

const MailWriteTemplate: React.FC = () => {

  const { data: userData } = useUser();
  const { useRecentEmails } = useMail();
  const { data: recentEmailsData } = useRecentEmails();
  const [showRecentRecipients, setShowRecentRecipients] = useState(false);

  // 최근 수신자 목록 (API 데이터 사용)
  const recentRecipients = useMemo(() => {
    if (!recentEmailsData?.recentEmails) return [];
    
    return recentEmailsData.recentEmails.map((item: RecentEmailItem) => ({
      name: item.owner || undefined, // owner가 빈 문자열이면 undefined로 설정
      email: item.email
    }));
  }, [recentEmailsData]);
  
  // 받는 사람 입력창 포커스 핸들러
  const handleRecipientFocus = () => {
    setShowRecentRecipients(true);
  };
  
  // 받는 사람 입력창 블러 핸들러
  const handleRecipientBlur = () => {
    // 약간의 지연을 두어 항목 클릭이 가능하도록 함
    setTimeout(() => {
      setShowRecentRecipients(false);
    }, 200);
  };
  
  // 최근 수신자 선택 핸들러
  const handleSelectRecipient = (email: string) => {
    // 이미 선택된 이메일이 아닌 경우에만 추가
    if (!to.includes(email)) {
      setTo([...to, email]);
    }
    setShowRecentRecipients(false);
  };
  
  const MAX_EMAIL_LENGTH = 254; // RFC 5321 기준
  const MAX_SUBJECT_LENGTH = 120; // 제목 최대 길이

  const navigate = useNavigate();
  const location = useLocation();
  const { sendMail } = useMail();
  const { attachments, clearAttachments } = useMailStore();
  const lastToastIdRef = useRef<string | number | null>(null);
  const { 
    isAiAssistantOpen, 
    openAiAssistant, 
    closeAiAssistant 
  } = useAiStore();

  const [to, setTo] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [showLoading, setShowLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [inReplyTo, setInReplyTo] = useState<string | null>(null);
  const [references, setReferences] = useState<string>('');


  // URL 쿼리 파라미터 파싱
  const queryParams = new URLSearchParams(location.search);
  const replyToId = queryParams.get('reply');
  const mailId = replyToId

  // 답장 또는 전달 메일 ID가 있을 때만 원본 메일 정보 가져오기
  const { data: originalMail } = useQuery({
    queryKey: ['mail', mailId],
    queryFn: () => mailService.getMailDetail(mailId!),
    enabled: !!mailId, // mailId가 있을 때만 쿼리 활성화
    staleTime: 0, // 항상 최신 데이터 사용
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 다시 가져오기
});
  
// 스레드 검색 - 같은 발신자/수신자와의 이메일 스레드 찾기
const { data: threadInfo } = useQuery({
  queryKey: ['mailThread', originalMail?.sender, mailId],
  queryFn: async () => {
    if (!originalMail) return null;
    
    // 같은 발신자와의 이메일 검색 (최근 30일 이내)
    try {
      const response = await mailService.getMailList(
        1,
        1, 
        5, 
        0, 
        originalMail.sender
      );
      
      // 같은 발신자와의 이메일이 있으면 가장 최근 메일의 threadId 반환
      if (response.emails && response.emails.length > 0) {
        const latestMail = response.emails[0];
        const detail = await mailService.getMailDetail(latestMail.id);
        return {
          threadId: detail.threadId || String(detail.id),
          references: detail.references || []
        };
      }
      return null;
    } catch (error) {
      console.error('스레드 검색 오류:', error);
      return null;
    }
  },
  enabled: !!originalMail && replyToId !== null,
  staleTime: 0,
});  
  // 토스트 메시지 표시 함수 (중복 방지)
  const showToast = (message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') => {
    // 이전 토스트가 있으면 닫기
    if (lastToastIdRef.current) {
      toast.dismiss(lastToastIdRef.current);
    }
    
    // 새 토스트 표시 및 ID 저장
    const toastId = toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    lastToastIdRef.current = toastId;
  };
  
  // 한국 시간 형식으로 변환하는 함수
  const formatKoreanDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'yyyy년 M월 d일 (E) a h:mm', { locale: ko });
  };
  
  // 원본 메일 정보로 폼 초기화
  useEffect(() => {
    if (originalMail && replyToId) {
      // 답장 모드
      const emailOnly = originalMail.sender.match(/<([^>]+)>/) ? 
      originalMail.sender.match(/<([^>]+)>/)?.[1] : originalMail.sender;

      setTo([emailOnly || '']);
  
      const rePrefix = /^RE:\s*/i;
      const newSubject = rePrefix.test(originalMail.subject) 
        ? originalMail.subject 
        : `RE: ${originalMail.subject}`;
      setSubject(newSubject);
      
      const displayDate = originalMail.emailType === 'SENT' 
        ? originalMail.sentDateTime 
        : originalMail.receivedDateTime;
  
      // HTML 형식으로 원본 메일 내용 추가
      const replyContent = `
        <p></p>
        <p></p>
        <div style="border-left: 1px solid #ccc; padding-left: 12px; margin: 10px 0; color: #666;">
          <p>---------- 원본 메일 ----------</p>
          <p><strong>보낸 사람:</strong> "${originalMail.sender}" &lt;${originalMail.sender}&gt;</p>
          <p><strong>날짜:</strong> ${formatKoreanDateTime(displayDate)}</p>
          <p><strong>제목:</strong> ${originalMail.subject}</p>
          <p><strong>받는 사람:</strong> ${originalMail.recipients.join(', ')}</p>
          <p></p>
          ${originalMail.bodyHtml || `<p>${originalMail.bodyText}</p>`}
        </div>
      `;
      setContent(replyContent);
  
      setInReplyTo(originalMail.messageId || null);

      let refsString = '';

      // 원본 메일의 references가 있으면 먼저 추가
      if (originalMail.references) {
        if (Array.isArray(originalMail.references)) {
          refsString = originalMail.references.join(' ');
        } else {
          refsString = originalMail.references;
        }
      }
      
      // 원본 메일의 messageId 추가
      if (originalMail.messageId) {
        // 기존 references가 있으면 공백 추가 후 messageId 추가
        if (refsString) {
          refsString += ' ' + originalMail.messageId;
        } else {
          refsString = originalMail.messageId;
        }
      }
      
      setReferences(refsString);
  
      setThreadId(originalMail.threadId || String(originalMail.id));

      console.log('답장 모드: 원본 메일 내용 설정 완료', {
        to: [originalMail.sender],
        subject: newSubject,
        content: replyContent.substring(0, 100) + '...',
        threadId: originalMail.threadId || String(originalMail.id),
        inReplyTo: originalMail.messageId || null,
        references: refsString
      });
    }
  }, [originalMail, replyToId, threadInfo]);

    // sendMail.isPending 상태가 변경될 때 로딩 상태 관리
    useEffect(() => {
    if (sendMail.isPending) {
        setShowLoading(true);
    } else if (!sendMail.isPending && showLoading) {
        // 최소 1초 동안 로딩 표시
        const timer = setTimeout(() => {
        setShowLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }
    }, [sendMail.isPending, showLoading]);

  // 컴포넌트 언마운트 시 첨부파일 상태 초기화
  useEffect(() => {
    return () => {
      clearAttachments();
    };
  }, [clearAttachments]);

  const handleSend = () => {
    // 유효성 검사
    if (to.length === 0) {
        showToast('받는 사람을 입력해주세요.', 'error');
        return;
      }
      
    if (!subject) {
      showToast('제목을 입력해주세요.', 'error');
      return;
    }

    const subjectContentRegex = /[a-zA-Z0-9가-힣]/;
    if (!subjectContentRegex.test(subject)) {
      showToast('제목에는 최소 하나 이상의 문자나 숫자가 포함되어야 합니다.', 'error');
      return;
    }
    
    // 첨부파일 정보 준비 (AttachmentInfo 형식으로 변환)
    const attachmentInfos = attachments.map(attachment => ({
      name: attachment.name,
      size: attachment.size,
      type: attachment.type
    }));

        // 이메일 주소 형식 정리 (모든 수신자에 대해)
    const cleanedRecipients = to.map(recipient => {
      // "이름" <이메일> 형식에서 이메일만 추출
      const emailMatch = recipient.match(/<([^>]+)>/);
      return emailMatch ? emailMatch[1] : recipient;
    });

    // 메일 전송 데이터 준비 
    const mailData: SendMailRequest = {
      sender: userData?.email || '',
      recipients: cleanedRecipients,
      subject,
      bodyText: content.replace(/<[^>]*>/g, ''), 
      bodyHtml: content,
      inReplyTo: inReplyTo,
      references: references,
      attachments: attachmentInfos // 첨부파일 정보 추가
    };
  
    console.log('Sending mail with recipients:', cleanedRecipients);
    console.log('Attachments:', attachments);
    console.log('Thread info:', { threadId, inReplyTo, references });
  
    // 첨부파일 File 객체 배열 준비
    const attachmentFiles = attachments.map(attachment => attachment.file).filter(Boolean) as File[];
  
    // 메일 전송 API 호출
    sendMail.mutate({ 
      mailData, 
      attachments: attachmentFiles 
    }, {
      onSuccess: () => {
        console.log('메일이 성공적으로 전송되었습니다.');
        // 전송 후 목록으로 이동
        setTimeout(() => {
          navigate('/mail/result', { state: { status: 'success' } });
        }, 1000);
      },
      onError: (error: Error | { status?: number; statusCode?: number; message?: string }) => {
        console.error('메일 전송 실패:', error);
        // 로딩 상태를 1초 동안 유지한 후 결과 페이지로 이동
        setTimeout(() => {
          navigate('/mail/result', { 
            state: { 
              status: 'error',
              code: (error as { status?: number; statusCode?: number }).status || (error as { statusCode?: number }).statusCode || 500,
              message: (error as { message?: string }).message || '메일 전송에 실패했습니다.'
            } 
          });
        }, 1000);
      }
    });
  };
  
  const handleCancel = () => {
    // 작성 취소 및 이전 페이지로 이동
    navigate(-1);
  };
    
  const handleSubjectChange = (newSubject: string) => {
    if (newSubject.length > MAX_SUBJECT_LENGTH) {
      showToast(`제목은 최대 ${MAX_SUBJECT_LENGTH}자까지 입력 가능합니다.`, 'warning');
      return;
    }
    setSubject(newSubject);
  };
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  
  const handleRecipientsChange = (newRecipients: string[]) => {
    // 각 이메일 주소의 길이 검사
    for (const email of newRecipients) {
      if (email.length > MAX_EMAIL_LENGTH) {
        showToast(`이메일 주소는 최대 ${MAX_EMAIL_LENGTH}자까지 입력 가능합니다.`, 'warning');
        return;
      }
    }
    setTo(newRecipients);
  };

  const handleAiAssistant = () => {
    openAiAssistant();
  };
  
  const handleCloseAiAssistant = () => {
    closeAiAssistant();
  };

  
  return (
   <div className={`flex flex-col h-full bg-white rounded-lg shadow overflow-auto ${isAiAssistantOpen ? 'mr-[400px]' : ''}`}>      <MailWriteHeader
        onSend={handleSend}
        onCancel={handleCancel}
        onAiAssistant={handleAiAssistant}
        aiButtonWidth="130px" 
        aiButtonHeight="30px"
        aiFontSize="11px"
        isSending={sendMail.isPending || showLoading}
      />
      
      <MailWriteForm
        initialTo={to}
        initialSubject={subject}
        initialContent={content}
        onSubjectChange={handleSubjectChange}
        onRecipientsChange={handleRecipientsChange}
        onContentChange={handleContentChange}
        fontOptions={FONT_OPTIONS}
        onRecipientFocus={handleRecipientFocus}
        onRecipientBlur={handleRecipientBlur}
        showRecentRecipients={showRecentRecipients}
        recentRecipients={recentRecipients}
        onSelectRecipient={handleSelectRecipient}
      />

        {/* 로딩 오버레이 */}
        {(sendMail.isPending || showLoading) && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className= "flex flex-col items-center">
                    <Spinner size="large" className="mb-4" />
                    <p className="text-white text-lg font-medium">메일을 전송 중입니다...</p>
                </div>
            </div>
        )}

        {/* AI 어시스턴트 */}
        <AiPageTemplate 
          isOpen={isAiAssistantOpen} 
          onClose={handleCloseAiAssistant}
          mode="template"
        />
    </div>
  );
};

export default MailWriteTemplate;
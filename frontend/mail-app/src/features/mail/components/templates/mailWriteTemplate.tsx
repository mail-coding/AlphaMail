import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MailWriteHeader } from '../organisms/mailWriteHeader';
import { MailWriteForm } from '../organisms/mailWriteForm';
import { useMail } from '../../hooks/useMail';
import { RecentEmailItem, SendMailRequest } from '../../types/mail';
import { Spinner } from '@/shared/components/atoms/spinner';
import { mailService } from '../../services/mailService';
import { useQuery } from '@tanstack/react-query';
import { useMailStore } from '../../stores/useMailStore';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import AiPageTemplate from './aiPageTemplate';
import { useAiStore } from '../../stores/useAiStore';
import { useUser } from '@/features/auth/hooks/useUser';
import { useHeaderStore } from '@/shared/stores/useHeaderStore';
import { showToast } from '@/shared/components/atoms/toast';

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
  const { setTitle } = useHeaderStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMail } = useMail();
  
  // Zustand 스토어에서 상태 구독
  const {
    to,
    subject,
    content,
    threadId,
    inReplyTo,
    references,
    attachments,
    setTo,
    setSubject,
    setContent,
    setThreadId,
    setInReplyTo,
    setReferences,
    addAttachment,
    removeAttachment,
    clearAttachments,
    resetMailCompose
  } = useMailStore();

  const { 
    isAiAssistantOpen, 
    openAiAssistant, 
    closeAiAssistant 
  } = useAiStore();

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setTitle('메일 작성');
  }, [setTitle]);

  // 최근 수신자 목록
  const recentRecipients = useMemo(() => {
    if (!recentEmailsData?.recentEmails) return [];
    
    return recentEmailsData.recentEmails.map((item: RecentEmailItem) => ({
      name: item.owner || undefined,
      email: item.email
    }));
  }, [recentEmailsData]);
  
  const handleRecipientFocus = () => {
    setShowRecentRecipients(true);
  };
  
  const handleRecipientBlur = () => {
    setTimeout(() => {
      setShowRecentRecipients(false);
    }, 200);
  };
  
  const handleSelectRecipient = (email: string) => {
    if (!to.includes(email)) {
      setTo([...to, email]);
    }
    setShowRecentRecipients(false);
  };
  
  const MAX_EMAIL_LENGTH = 254;
  const MAX_SUBJECT_LENGTH = 120;

  const queryParams = new URLSearchParams(location.search);
  const replyToId = queryParams.get('reply');
  const mailId = replyToId;

  const { data: originalMail } = useQuery({
    queryKey: ['mail', mailId],
    queryFn: () => mailService.getMailDetail(mailId!),
    enabled: !!mailId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  const { data: threadInfo } = useQuery({
    queryKey: ['mailThread', originalMail?.sender, mailId],
    queryFn: async () => {
      if (!originalMail) return null;
      
      try {
        const response = await mailService.getMailList(1, 1, 5, 0, originalMail.sender);
        
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
  
  const formatKoreanDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'yyyy년 M월 d일 (E) a h:mm', { locale: ko });
  };
  
  // 원본 메일 정보로 폼 초기화
  useEffect(() => {
    if (originalMail && replyToId) {
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
      if (originalMail.references) {
        if (Array.isArray(originalMail.references)) {
          refsString = originalMail.references.join(' ');
        } else {
          refsString = originalMail.references;
        }
      }
      
      if (originalMail.messageId) {
        if (refsString) {
          refsString += ' ' + originalMail.messageId;
        } else {
          refsString = originalMail.messageId;
        }
      }
      
      setReferences(refsString);
      setThreadId(originalMail.threadId || String(originalMail.id));

      console.log('답장 모드: 원본 메일 내용 설정 완료');
    }
  }, [originalMail, replyToId, setTo, setSubject, setContent, setInReplyTo, setReferences, setThreadId]);

  useEffect(() => {
    if (sendMail.isPending) {
      setShowLoading(true);
    } else if (!sendMail.isPending && showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [sendMail.isPending, showLoading]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      resetMailCompose();
    };
  }, [resetMailCompose]);

  const handleSend = () => {
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
    
    const attachmentInfos = attachments.map(attachment => ({
      name: attachment.name,
      size: attachment.size,
      type: attachment.type
    }));

    const cleanedRecipients = to.map(recipient => {
      const emailMatch = recipient.match(/<([^>]+)>/);
      return emailMatch ? emailMatch[1] : recipient;
    });

    const mailData: SendMailRequest = {
      sender: userData?.email || '',
      recipients: cleanedRecipients,
      subject,
      bodyText: content.replace(/<[^>]*>/g, ''), 
      bodyHtml: content,
      inReplyTo: inReplyTo,
      references: references,
      attachments: attachmentInfos
    };
  
    const attachmentFiles = attachments.map(attachment => attachment.file).filter(Boolean) as File[];
  
    sendMail.mutate({ 
      mailData, 
      attachments: attachmentFiles 
    }, {
      onSuccess: () => {
        resetMailCompose();
        setTimeout(() => {
          navigate('/mail/result', { state: { status: 'success' } });
        }, 1000);
      },
      onError: (error: Error | { status?: number; statusCode?: number; message?: string }) => {
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
    resetMailCompose();
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
    <div className={`flex flex-col h-full bg-white rounded-lg shadow overflow-auto ${isAiAssistantOpen ? 'mr-[400px]' : ''}`}>
      <MailWriteHeader
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

      {(sendMail.isPending || showLoading) && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Spinner size="large" className="mb-4" />
            <p className="text-white text-lg font-medium">메일을 전송 중입니다...</p>
          </div>
        </div>
      )}

      <AiPageTemplate 
        isOpen={isAiAssistantOpen} 
        onClose={handleCloseAiAssistant}
        mode="template"
      />
    </div>
  );
};

export default MailWriteTemplate;

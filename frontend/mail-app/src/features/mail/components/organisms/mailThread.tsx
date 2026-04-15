import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import './mailThread.css';  // CSS 파일 import
import { Typography } from '@/shared/components/atoms/Typography';
import { FaInbox, FaPaperPlane } from 'react-icons/fa';

interface ThreadMail {
    emailId: number;
    sender: string;
    subject: string;
    dateTime: string;
    originalFolderId: number;
    folderName: string;
}
  
interface MailThreadListProps {
    currentMailId: number;
    threadMails: ThreadMail[];
}

export const MailThreadList: React.FC<MailThreadListProps> = ({ 
  currentMailId, 
  threadMails 
}) => {
  const navigate = useNavigate();

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
  const today = new Date();
  
  const isToday = date.toDateString() === today.toDateString();
  
  const koreaDate = addHours(date, 9);
  
  return isToday 
    ? format(koreaDate, 'a h:mm', { locale: ko }) 
    : format(koreaDate, 'yyyy.MM.dd', { locale: ko });
  };
  
  // 폴더 ID에 따른 경로 결정
  const getMailPath = (mail: ThreadMail) => {
    // folderName을 대문자로 변환하여 비교
    const folder = mail.folderName.toUpperCase();
    
    switch (folder) {
      case 'INBOX': return `/mail/${mail.emailId}`;
      case 'SENT': return `/mail/sent/${mail.emailId}`;
      case 'TRASH': return `/mail/trash/${mail.emailId}`;
      default: return `/mail/${mail.emailId}`;
    }
  };

  // 메일 클릭 핸들러
  const handleMailClick = (mail: ThreadMail) => {
    navigate(getMailPath(mail));
  };
  
  if (!threadMails || threadMails.length <= 1) return null;

  // 시간순으로 정렬 (최신 메일이 위에 오도록)
  const sortedThreadMails = [...threadMails].sort((a, b) => {
    return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
  });
  
  return (
    <div className="mt-6 border-t border-gray-200 p-6">
      <div className="flex items-center mb-3 pl-0">
        <Typography variant="titleSmall" bold className="text-gray-700">
        주고 받은 메일 
        </Typography>
        <Typography variant="titleSmall" bold className="text-blue-400 ml-1">
          {threadMails.length}
        </Typography>
      </div>      
      <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden p-6">
        {sortedThreadMails.map((mail) => (
          <div 
            key={mail.emailId}
            className={`flex items-center p-4 mb-2 rounded-lg border border-gray-100 last:mb-0 cursor-pointer hover:bg-blue-50 transition-colors
              ${mail.emailId === currentMailId ? 'bg-blue-100' : 'bg-white'}`}
            onClick={() => mail.emailId !== currentMailId && handleMailClick(mail)}
          >
            <div className="flex-shrink-0 w-8 mr-3 text-center">
              {/* folderName으로 메일 타입 추정 */}
              {mail.folderName.toUpperCase() === 'INBOX' ? (
                <FaInbox className="text-blue-400 w-5 h-5 mx-auto" title="받은 메일" />
              ) : (
                <FaPaperPlane className="text-blue-400 w-5 h-5 mx-auto" title="보낸 메일" />
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center">
                <Typography 
                  variant="body" 
                  bold 
                  className="truncate mr-2"
                >
                  {mail.folderName.toUpperCase() === 'INBOX' ? mail.sender.split('<')[0].trim() : '나'}
                </Typography>
                <Typography 
                  variant="caption" 
                  className="text-gray-500"
                >
                  {formatDate(mail.dateTime)}
                </Typography>
              </div>
              <Typography 
                variant="body" 
                className="text-gray-600 truncate"
              >
                {mail.subject}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
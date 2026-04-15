import React, { useState, useEffect } from 'react';
import { MailList } from '../organisms/mailList';
import { MailListHeader } from '../organisms/mailListHeader';
import { Pagination } from '../organisms/pagination';
import { Typography } from '@/shared/components/atoms/Typography';
import { useMail } from '../../hooks/useMail';
import { useMailStore } from '../../stores/useMailStore';
import { Mail, MailListRow } from '../../types/mail';
import { useHeaderStore } from '@/shared/stores/useHeaderStore';
import { useNavigate } from 'react-router-dom';
import { useFolders } from '../../hooks/useFolders';

const SentMailTemplate: React.FC = () => {
  // 보낸 메일함은 folderId가 2
  const { 
    currentPage, 
    sortOrder,
    searchKeyword,
    selectedMails, 
    currentFolder,
    setCurrentPage, 
    selectMail, 
    unselectMail, 
    selectAllMails, 
    clearSelection,
    setCurrentFolder,
    getFolderIdByType,
    folderLoading
  } = useMailStore();
  
    // 폴더 정보 로드
    const { isLoading: isFoldersLoading } = useFolders();
  
    // 보낸 메일함 ID 가져오기
    const sentFolderId = getFolderIdByType('sent');
    
    // 컴포넌트 마운트 시 현재 폴더를 보낸 메일함으로 설정
    useEffect(() => {
      // 현재 폴더가 설정되어 있지 않은 경우에만 설정
      if (sentFolderId && !currentFolder) {
        setCurrentFolder(sentFolderId);
      }
    }, [sentFolderId, currentFolder, setCurrentFolder]);
  
  const { useMailList, moveToTrash } = useMail();
  const { data, isLoading, error, refetch } = useMailList( sentFolderId, currentPage, sortOrder, searchKeyword);
  const { setMailStats } = useHeaderStore();
  const navigate = useNavigate();
  const [allSelected, setAllSelected] = useState(false);
  
  useEffect(() => {
    if (data) {
      const totalCount = data.totalCount || 0;
      setMailStats(totalCount, 0);
    }
  }, [data, setMailStats]);

  useEffect(() => {
    // 페이지 변경 시 선택 초기화
    clearSelection();
  }, [currentPage, clearSelection]);
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      selectAllMails(data?.emails.map((mail: MailListRow) => mail.id.toString()) || []);
    } else {
      clearSelection();
    }
    setAllSelected(selected);
  };
  
  const handleSelectMail = (id: string, selected: boolean) => {
    if (selected) {
      selectMail(id);
    } else {
      unselectMail(id);
    }
  };
  
  const handleMailClick = (id: string) => {
    navigate(`/mail/sent/${id}?page=${currentPage}`);
  };
    
  const handleDelete = () => {
    if (selectedMails.length > 0) {
      moveToTrash.mutate({ mailIds: selectedMails }, {
        onSuccess: () => {
          // 삭제 성공 후 메일 목록 다시 가져오기
          refetch();
          // 선택 상태 초기화
          clearSelection();
          setAllSelected(false);
        }
      });
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // API 응답 구조에 맞게 메일 데이터 변환
  const transformMailsData = (emails: MailListRow[] = []): Mail[] => {
    return emails.map(mail => {
      // UTC 시간을 한국 시간으로 변환 (UTC+9)
      const receivedTime = mail.receivedDateTime || mail.sentDateTime;
      const koreaTime = new Date(new Date(receivedTime).getTime() + 9 * 60 * 60 * 1000).toISOString();
      
      // 보낸 메일함에서는 수신자 정보를 표시
      // recipients 배열의 첫 번째 수신자를 사용 (수신자가 여러 명일 경우)
        // 보낸 메일함에서는 수신자 정보를 표시
    let recipientName = '수신자 없음';
    let recipientEmail = 'unknown@example.com';
    
    if (mail.recipients && mail.recipients.length > 0) {
      // 첫 번째 수신자 이메일 가져오기
      recipientEmail = mail.recipients[0];
      
      // 첫 번째 수신자 이름 (@앞 부분 추출)
      recipientName = recipientEmail.split('@')[0];
      
      // 추가 수신자가 있는 경우 "외 X명" 추가
      if (mail.recipients.length > 1) {
        recipientName += ` 외 ${mail.recipients.length - 1}명`;
      }
    }

      return {
        id: mail.id.toString(),
        subject: mail.subject,
        sender: {
          name: recipientName,
          email: recipientEmail
        },
        receivedAt: koreaTime,
        isRead: mail.readStatus === undefined ? true : mail.readStatus,
        attachmentSize: mail.size > 0 ? mail.size : 0
      };
    });
  };

  return (
    <div className="mail-main-container">      
      <MailListHeader
        allSelected={allSelected}
        onSelectAll={handleSelectAll}
        onMoveToTrash={handleDelete}
        selectedCount={selectedMails.length}
        folderType="sent"
      />
      
      {isLoading || isFoldersLoading || folderLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <Typography variant="body">로딩 중...</Typography>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[200px]">
          <Typography variant="body" color="text-red-500">에러가 발생했습니다.</Typography>
        </div>
      ) : (
        <>
          <MailList
            mails={transformMailsData(data?.emails)}
            selectedMailIds={selectedMails}
            onSelectMail={handleSelectMail}
            onMailClick={handleMailClick}
          />
          
          <Pagination
            currentPage={(data?.currentPage || 0) + 1}
            totalPages={data?.pageCount || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default SentMailTemplate;
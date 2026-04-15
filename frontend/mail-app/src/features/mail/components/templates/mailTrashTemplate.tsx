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
import { showToast } from '@/shared/components/atoms/toast';
import { WarningModal } from "@/shared/components/warningModal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/atoms/button";

const MailTrashTemplate: React.FC = () => {
  // 휴지통은 folderId가 3
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 폴더 정보 로드
  const { isLoading: isFoldersLoading } = useFolders();
  
  // 휴지통 ID 가져오기
  const trashFolderId = getFolderIdByType('trash');
  
  // 컴포넌트 마운트 시 현재 폴더를 휴지통으로 설정
  useEffect(() => {
    // 현재 폴더가 설정되어 있지 않은 경우에만 설정
    if (trashFolderId && !currentFolder) {
      setCurrentFolder(trashFolderId);
    }
  }, [trashFolderId, currentFolder, setCurrentFolder]);

  const { useMailList, emptyTrash, restoreMailsToOrigin } = useMail();
  const { data, isLoading, error, refetch } = useMailList(trashFolderId, currentPage, sortOrder, searchKeyword);
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
    navigate(`/mail/trash/${id}?page=${currentPage}`);
  };  

  // 휴지통 비우기 (모든 메일 영구 삭제)
  const handleEmptyTrash = () => {
    if (selectedMails.length === 0) {
      showToast('삭제할 메일을 선택해주세요.', 'warning');
      return;
    }
    
    // 모달 열기
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 처리 함수
  const confirmDelete = () => {
    emptyTrash.mutate({ mailIds: selectedMails }, {
      onSuccess: () => {
        // 삭제 성공 후 메일 목록 다시 가져오기
        refetch();
        // 선택 상태 초기화
        clearSelection();
        setAllSelected(false);
        // 모달 닫기
        setIsDeleteModalOpen(false);
      }
    });
  };

  const handleRestore = () => {
    if (selectedMails.length > 0) {
      // 선택된 메일을 원래 폴더로 복원
      restoreMailsToOrigin.mutate({ emailIds: selectedMails }, {
        onSuccess: () => {
          // 복원 성공 후 메일 목록 다시 가져오기
          refetch();
          // 선택 상태 초기화
          clearSelection();
          setAllSelected(false);
        }
      });
    } else {
      showToast('복원할 메일을 선택해주세요.', 'warning');
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
    
    return {
      id: mail.id.toString(),
      subject: mail.subject,
      sender: {
        name: mail.sender.split('@')[0],
        email: mail.sender
      },
      receivedAt: koreaTime,
      isRead: mail.readStatus === undefined ? true : mail.readStatus,
      attachmentSize: mail.size > 0 ? mail.size : 0
    };
  });
};

  return (
    <div className="mail-main-container">      
      <div className="flex justify-between items-center mb-4">
        <MailListHeader
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
          selectedCount={selectedMails.length}
          onRestore={handleRestore}
          folderType="trash"
          onEmptyTrash={handleEmptyTrash}
        />
        
      </div>
              
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
      <WarningModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-500" />}
        title={<Typography variant="titleMedium">메일 영구 삭제</Typography>}
        description={
          <Typography variant="body">
            선택한 {selectedMails.length}개의 메일을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Typography>
        }
        actions={
          <>
            <Button
              variant="text"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              영구 삭제
            </Button>
          </>
        }
      />
    </div>
  );
};

export default MailTrashTemplate;
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { mailService } from '../services/mailService';
import { MAIL_QUERY_KEYS } from '../constants/queryKeys';
import { FolderResponse, SendMailRequest } from '../types/mail';
import { useUser } from '@/features/auth/hooks/useUser';
import { showToast } from '@/shared/components/atoms/toast';

  export const useMail = () => {
    const queryClient = useQueryClient();
    const { data: userData } = useUser();
    const userId = userData?.id;
    
    const useFolders = () => {
      return useQuery({
        queryKey: [...MAIL_QUERY_KEYS.folders(), userId],
        queryFn: () => mailService.getFolders(),
        staleTime: 30* 60 * 1000,
        enabled: !!userId,
      });
    };

    // useQuery 직접 호출
    const useMailList = (folderId?: number, page: number = 1, sort: number = 0, keyword?: string) => {
      const { data: userData } = useUser();
      const userId = userData?.id;    
      
      return useQuery({
        queryKey: MAIL_QUERY_KEYS.mailList(folderId, page, sort, keyword),
        queryFn: () => mailService.getMailList(folderId, page, 15, sort, keyword),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        enabled: !!userId && folderId !== undefined,
      });
    };
    
    // useQuery 직접 호출
    const useMailDetail = (id: string) => {
      return useQuery({
        queryKey: MAIL_QUERY_KEYS.mailDetail(id),
        queryFn: () => mailService.getMailDetail(id),
        enabled: !!id,
      });
    };
      
    // 메일 읽음 상태 변경 뮤테이션
    const markAsRead = useMutation({
      mutationFn: ({ ids }: { ids: string[] }) => 
        Promise.all(ids.map(id => mailService.updateMailReadStatus( Number(id), true))),
      onSuccess: (_, variables) => {
        // 메일 목록 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
        
        // 메일 상세 쿼리도 무효화 (변경된 메일만)
        variables.ids.forEach(id => {
          queryClient.invalidateQueries({ queryKey: MAIL_QUERY_KEYS.mailDetail(id) });
        });
      },
    });
    
    // 메일 안읽음 상태 변경 뮤테이션
    const markAsUnread = useMutation({
      mutationFn: ({ ids }: { ids: string[] }) => 
        Promise.all(ids.map(id => mailService.updateMailReadStatus(Number(id), false))),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
      },
    });
    
    // 메일 휴지통으로 이동 뮤테이션
    const moveToTrash = useMutation({
      mutationFn: async ({ mailIds }: { mailIds: string[]}) => {
        // 문자열 ID를 숫자로 변환
        const numericIds = mailIds.map(id => parseInt(id, 10));
        // 수정된 API 명세에 맞게 서비스 호출
        return mailService.deleteMails( numericIds);
      },
      onSuccess: () => {
        // 성공 시 메일 목록 쿼리 무효화 (모든 폴더)
        queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
        showToast('메일이 휴지통으로 이동되었습니다.', 'success');
      },
      onError: (error) => {
        console.error('메일 삭제 오류:', error);
        showToast('메일을 휴지통으로 이동하는 중 오류가 발생했습니다.', 'error');
      }
    });

    // 메일 상세에서 휴지통으로 이동 뮤테이션
    const moveMailToTrash = useMutation({
      mutationFn: ({ mailId, folderId = 3 }: { mailId: string, folderId?: number }) => 
        mailService.deleteMailById(Number(mailId), folderId),
      onSuccess: () => {
        // 성공 시 메일 목록 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
        showToast('메일이 휴지통으로 이동되었습니다.', 'success');
      },
      onError: (error) => {
        console.error('메일 삭제 오류:', error);
        showToast('메일을 휴지통으로 이동하는 중 오류가 발생했습니다.', 'error');
      }
    });
      
    // 메일 폴더 이동 뮤테이션
    const moveToFolder = useMutation({
      mutationFn: ({ ids, targetFolderId }: { ids: string[], targetFolderId: number }) => 
        mailService.moveMails(ids.map(Number), targetFolderId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
      },
    });
    
    // 휴지통 비우기 뮤테이션 추가
    const emptyTrash = useMutation({
      mutationFn: ({ mailIds }: { mailIds: string[] }) => 
        mailService.emptyTrash({ mailIds }),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
        showToast(`${data.deletedCount}개의 메일이 영구 삭제되었습니다.`, 'success');
      },
      onError: (error) => {
        console.error('메일 영구 삭제 오류:', error);
        showToast('메일을 영구 삭제하는 중 오류가 발생했습니다.', 'error');
      }
    });

    // 메일 전송 뮤테이션
  const sendMail = useMutation({
    mutationFn: ({ 
      mailData, 
      attachments = [], 
    }: { 
      mailData: SendMailRequest, 
      attachments?: File[], 
    }) => mailService.sendMail( mailData, attachments),
    onSuccess: () => {
      // 보낸메일함(폴더 ID: 2) 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: MAIL_QUERY_KEYS.mailList(1, 2),  
        refetchType: 'all'
      });
    },
    onError: (error) => {
      console.error('메일 전송 오류:', error);
    }
  });
  
  // 폴더 이름으로 폴더 ID 찾기 유틸리티 함수
  const getFolderIdByName = (folders: FolderResponse[] | undefined, name: string): number | undefined => {
    if (!folders) return undefined;
    
    const folder = folders.find(f => 
      f.folderName.toUpperCase() === name.toUpperCase() || 
      (name === "받은 메일함" && f.folderName.toUpperCase() === "INBOX") ||
      (name === "보낸 메일함" && f.folderName.toUpperCase() === "SENT") ||
      (name === "휴지통" && f.folderName.toUpperCase() === "TRASH")
    );
    
    return folder?.id;
  };
  
  // 첨부파일 다운로드 뮤테이션
  const downloadAttachment = useMutation({
    mutationFn: async ({ 
      mailId, 
      attachmentId, 
      fileName, 
    }: { 
      mailId: number, 
      attachmentId: number, 
      fileName: string, 
    }) => {
      const blob = await mailService.downloadAttachment(mailId, attachmentId);
      
      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // 정리
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    },
    onError: (error) => {
      console.error('첨부파일 다운로드 오류:', error);
      showToast('첨부파일 다운로드 중 오류가 발생했습니다.', 'error');
    }
  });

  const restoreMailsToOrigin = useMutation({
    mutationFn: ({ emailIds }: { emailIds: string[] }) => 
      mailService.restoreMailsToOrigin(emailIds.map(Number)),
    onSuccess: () => {
      // 성공 시 메일 목록 쿼리 무효화 (모든 폴더)
      queryClient.invalidateQueries({ queryKey: ['mails'], refetchType: 'all' });
      showToast('메일이 원래 폴더로 복원되었습니다.', 'success');
    },
    onError: (error) => {
      console.error('메일 복원 오류:', error);
      showToast('메일을 복원하는 중 오류가 발생했습니다.', 'error');
    }
  });

    // 최근 수신자 목록 조회 훅
    const useRecentEmails = () => {
      const { data: userData } = useUser();
      const userId = userData?.id;
      
      return useQuery({
        queryKey: [...MAIL_QUERY_KEYS.recentEmails(), userId],
        queryFn: () => mailService.getRecentEmails(),
        staleTime: 0,
        enabled: !!userId,
      });
    };
  
  return {
    useMailList,
    useMailDetail,
    markAsRead,
    markAsUnread,
    moveToTrash,
    moveToFolder,
    sendMail,
    moveMailToTrash,
    emptyTrash,
    useFolders,
    getFolderIdByName,
    downloadAttachment,
    restoreMailsToOrigin,
    useRecentEmails,
  };
};
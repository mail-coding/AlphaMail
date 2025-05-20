import { useQuery } from '@tanstack/react-query';
import { mailService } from '@/features/mail/services/mailService';
import { useMail } from '@/features/mail/hooks/useMail';
import { useUser } from '@/features/auth/hooks/useUser';

export const useUnreadMails = (limit: number = 10) => {
  const { useFolders } = useMail();
  const { data: foldersData } = useFolders();
  const { data: userData } = useUser();
  const userId = userData?.id;
  
  // 받은 메일함(INBOX) 폴더 ID 찾기
  const inboxFolderId = foldersData?.find(folder => 
    folder.folderName.toUpperCase() === 'INBOX')?.id;
  
  return useQuery({
    queryKey: ['mails', 'unread', inboxFolderId, limit],
    queryFn: async () => {
      if (!inboxFolderId) return { data: [], totalCount: 0 };
      
      // 받은 메일함에서 안읽은 메일만 가져오기
      const response = await mailService.getMailList(
        inboxFolderId,
        1,  // 첫 페이지
        15, // 페이지 크기
        0,  // 최신순 정렬
        undefined, // 검색어 없음
        false // 안읽은 메일만 (readStatus=false)
      );
      
      // 최대 표시 개수 제한
      return {
        data: response.emails.slice(0, limit),
        totalCount: response.totalCount
      };
    },
    enabled: !!inboxFolderId && !!userId,
    staleTime: 0,
    refetchInterval: 20000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
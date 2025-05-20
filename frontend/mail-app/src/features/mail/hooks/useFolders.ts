import { useQuery } from '@tanstack/react-query';
import { mailService } from '../services/mailService';
import { useMailStore } from '../stores/useMailStore';
import { useEffect } from 'react';
import { useUser } from '@/features/auth/hooks/useUser';

export const useFolders = () => {
  const { setFolders, setFolderLoading } = useMailStore();
  const { data: userData } = useUser();
  const userId = userData?.id;
  
  const query = useQuery({
    queryKey: ['folders', userId],
    queryFn: () => mailService.getFolders(),
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    enabled: !!userId,
  });
  
  useEffect(() => {
    if (query.data) {
      setFolders(query.data);
    }
    setFolderLoading(query.isLoading);
  }, [query.data, query.isLoading, setFolders, setFolderLoading]);
  
  return query;
};
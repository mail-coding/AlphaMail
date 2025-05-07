import React, { useEffect } from 'react';
import MainTemplate from '@/features/mail/components/templates/mainTemplate';
import { useSidebarStore } from '@/shared/stores/useSidebarStore';
import { useMailStore } from '@/features/mail/stores/useMailStore';
import { useHeaderStore } from '@/shared/stores/useHeaderStore';
import { useLocation } from 'react-router-dom';

const MailPage: React.FC = () => {
  const { setActiveItem } = useSidebarStore();
  const { setCurrentFolder } = useMailStore();
  const { setTitle } = useHeaderStore();
  const location = useLocation();
  const path = location.pathname;

  // 컴포넌트 마운트 시 초기 설정
  useEffect(() => {
    // URL 경로에 따라 적절한 폴더와 타이틀 설정
    if (path === '/mail') {
      setActiveItem("받은 메일함");
      setTitle("받은 메일함");
      setCurrentFolder(1);
    } else if (path === '/mail/sent') {
      setActiveItem("보낸 메일함");
      setTitle("보낸 메일함");
      setCurrentFolder(2);
    } else if (path === '/mail/trash') {
      setActiveItem("휴지통");
      setTitle("휴지통");
      setCurrentFolder(3);
    }
  }, [path, setActiveItem, setCurrentFolder, setTitle]);

  return (
    <div>
      <MainTemplate />
    </div>
  );
};

export default MailPage;
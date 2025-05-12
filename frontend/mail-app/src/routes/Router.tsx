import { Routes, Route } from 'react-router-dom';
import  HomePage  from '@/pages/HomePage';
import  MailPage  from '@/pages/MailPage';
import  SchedulePage  from '@/pages/SchedulePage';
import  WorkPage  from '@/pages/WorkPage';
import  GroupManagePage  from '@/pages/GroupManagePage';
import  SearchTest  from '@/pages/SearchTest';
import MailDetailTemplate from '@/features/mail/components/templates/mailDetailTemplate';
import MailWriteTemplate from '@/features/mail/components/templates/mailWriteTemplate';
import MailResultTemplate from '@/features/mail/components/templates/mailResultTemplate';
import MailTrashTemplate from '@/features/mail/components/templates/mailTrashTemplate';
import SentMailTemplate from '@/features/mail/components/templates/sentMailTemplate';
import LoginPage from '@/pages/LoginPage';
export const Router = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mail" element={<MailPage />} />
        <Route path="/mail/:id" element={<MailDetailTemplate source="inbox" />} />
        <Route path="/mail/sent" element={<SentMailTemplate />} />
        <Route path="/mail/sent/:id" element={<MailDetailTemplate source="sent" />} />
        <Route path="/mail/trash" element={<MailTrashTemplate />} /> 
        <Route path="/mail/trash/:id" element={<MailDetailTemplate source="trash" />} />
        <Route path="/mail/write" element={<MailWriteTemplate />} />
        <Route path="/mail/result" element={<MailResultTemplate />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/group" element={<GroupManagePage />} />
        <Route path="/search-test" element={<SearchTest />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
  );
};

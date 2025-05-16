import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import MailPage from '@/pages/MailPage';
import SchedulePage from '@/pages/SchedulePage';
import WorkPage from '@/pages/WorkPage';
import GroupManagePage from '@/pages/GroupManagePage';
import SearchTest from '@/pages/SearchTest';
import MailDetailTemplate from '@/features/mail/components/templates/mailDetailTemplate';
import MailWriteTemplate from '@/features/mail/components/templates/mailWriteTemplate';
import MailResultTemplate from '@/features/mail/components/templates/mailResultTemplate';
import MailTrashTemplate from '@/features/mail/components/templates/mailTrashTemplate';
import SentMailTemplate from '@/features/mail/components/templates/sentMailTemplate';
import { UserManageTemplate } from '@/features/auth/components/template/userManageTemplate';
import { PasswordConfirmTemplate } from '@/features/auth/components/template/passwordConfirmTemplate';

export const Router = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      {/* Mail Routes */}
      <Route path="/mail/*" element={
        <ProtectedRoute>
          <MailPage />
        </ProtectedRoute>
      } />
      <Route path="/mail/:id" element={<MailDetailTemplate source="inbox" />} />
      <Route path="/mail/sent" element={<SentMailTemplate />} />
      <Route path="/mail/sent/:id" element={<MailDetailTemplate source="sent" />} />
      <Route path="/mail/trash" element={<MailTrashTemplate />} />
      <Route path="/mail/trash/:id" element={<MailDetailTemplate source="trash" />} />
      <Route path="/mail/write" element={<MailWriteTemplate />} />
      <Route path="/mail/result" element={<MailResultTemplate />} />
      
      {/* Schedule Routes */}
      <Route path="/schedule/*" element={
        <ProtectedRoute>
          <SchedulePage />
        </ProtectedRoute>
      } />
      
      {/* Work Routes */}
      <Route path="/work/*" element={
        <ProtectedRoute>
          <WorkPage />
        </ProtectedRoute>
      } />
      
      {/* Group Management Routes */}
      <Route path="/group" element={<GroupManagePage />} />
      <Route path="/search-test" element={<SearchTest />} />
      
      {/* User Management Routes */}
      <Route path="/user/confirm-password" element={
        <ProtectedRoute>
          <PasswordConfirmTemplate />
        </ProtectedRoute>
      } />
      <Route path="/user/manage" element={
        <ProtectedRoute>
          <UserManageTemplate />
        </ProtectedRoute>
      } />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

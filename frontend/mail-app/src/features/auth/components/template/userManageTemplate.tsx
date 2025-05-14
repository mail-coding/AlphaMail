import React, { useState, useEffect } from 'react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { api } from '@/shared/lib/axiosInstance';

interface UserInfo {
  id: number;
  email: string;
  name: string;
  phone: string;
  position: string;
  department: string;
  companyId: number;
  groupId: number;
}

export const UserManageTemplate: React.FC = () => {
  const { data: userInfo, refetch } = useUserInfo();
  const [formData, setFormData] = useState<UserInfo>({
    id: 0,
    email: '',
    name: '',
    phone: '',
    position: '',
    department: '',
    companyId: 0,
    groupId: 0,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        phone: userInfo.phoneNum || '',
        position: userInfo.position || '',
        department: userInfo.groupName || '',
        companyId: userInfo.companyId,
        groupId: userInfo.groupId,
      });
    }
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 기본 정보 업데이트
      await api.put(`/api/erp/users/${formData.id}`, {
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
      });

      // 비밀번호가 입력된 경우에만 비밀번호 변경
      if (newPassword) {
        if (newPassword.length < 8) {
          setMessage({ type: 'error', text: '비밀번호는 8자 이상이어야 합니다.' });
          return;
        }
        if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
          return;
        }

        await api.put(`/api/erp/users/${formData.id}/password`, {
          newPassword
        });
      }

      setMessage({ type: 'success', text: '사용자 정보가 성공적으로 수정되었습니다.' });
      refetch();
      
      // 비밀번호 필드 초기화
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to update user:', error);
      setMessage({ type: 'error', text: '사용자 정보 수정에 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">사용자 정보 수정</h2>
        <p className="text-gray-600 mt-2">현재 로그인한 사용자의 정보를 수정할 수 있습니다.</p>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
            <p className="mt-1 text-sm text-gray-500">이메일은 변경할 수 없습니다.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">직책</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">부서</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">비밀번호 변경</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="새 비밀번호 (8자 이상)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="새 비밀번호 확인"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

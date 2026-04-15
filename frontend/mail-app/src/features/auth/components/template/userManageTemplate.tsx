import React, { useState, useEffect, useRef } from 'react';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { api } from '@/shared/lib/axiosInstance';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { showToast } from '@/shared/components/atoms/toast';
import { useQueryClient } from '@tanstack/react-query';

// 메인 컴포넌트 시작
export const UserManageTemplate: React.FC = () => {
  // 유저 정보 가져오기
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: 0,
    email: '',
    name: '',
    phone: '',
    position: '',
    department: '',
    companyId: 0,
    groupId: 0,
    image: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImg, setProfileImg] = useState<string>('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // 유저 정보가 로드되면 폼 데이터 설정
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
        image: userInfo.image || '',
      });
      setProfileImg(userInfo.image || '/profile-default.png');
    }
  }, [userInfo]);

  // 비밀번호 변경 처리
  const handlePasswordChange = async (): Promise<void> => {
    setMessage({ type: '', text: '' });

    // 현재 비밀번호 입력 확인
    if (!currentPassword) {
      showToast('현재 비밀번호를 입력해주세요.', 'error');
      return;
    }

    // 새 비밀번호 입력 확인
    if (!newPassword) {
      showToast('새 비밀번호를 입력해주세요.', 'error');
      return;
    }

    // 새 비밀번호 길이 검사 (8자 이상)
    if (newPassword.length < 8) {
      showToast('새 비밀번호는 8자 이상이어야 합니다.', 'error');
      return;
    }

    // 새 비밀번호 확인 일치 검사
    if (newPassword !== confirmPassword) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.patch(`/api/users/password`, {
        currPassword: currentPassword,
        newPassword: newPassword,
      });

      // 성공 메시지
      showToast('비밀번호가 성공적으로 변경되었습니다.', 'success');

      // 입력 필드 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 전화번호 형식 변환
  const formatPhoneNumber = (value: string): string => {
    const numbersOnly = value.replace(/\D/g, '');

    if (numbersOnly.startsWith('02')) {
      // 서울 지역번호
      if (numbersOnly.length <= 2) return numbersOnly;
      if (numbersOnly.length <= 5) return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2)}`;
      if (numbersOnly.length <= 9)
        return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 5)}-${numbersOnly.slice(5)}`;
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6, 10)}`;
    } else {
      // 휴대폰 또는 일반 지역번호 (3자리)
      if (numbersOnly.length <= 3) return numbersOnly;
      if (numbersOnly.length <= 6)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      if (numbersOnly.length <= 10)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
    }
  };

  // 전화번호 유효성 검사
  const isValidPhoneNumber = (value: string): boolean => {
    const phoneRegex = /^(010-\d{4}-\d{4}|01[16789]-\d{3,4}-\d{4}|02-\d{3,4}-\d{4}|(031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)-\d{3,4}-\d{4})$/;
    return phoneRegex.test(value);
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // 전화번호 필드 특별 처리
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      return;
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 확장자 검사
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        showToast('이미지는 .png, .jpg, .jpeg 파일만 업로드할 수 있습니다.', 'error'); // alert -> toast.error
        return;
      }

      // 파일 크기 제한 (2MB)
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        showToast('이미지는 2MB 이하만 업로드할 수 있습니다.', 'error'); // alert -> toast.error
        return;
      }

      // MIME 타입 검사
      if (!file.type.startsWith('image/')) {
        showToast('유효한 이미지 파일이 아닙니다.', 'error'); // alert -> toast.error
        return;
      }

      // 이미지 콘텐츠 검증
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>): void => {
        try {
          const img = new Image();
          img.onload = (): void => {
            setProfileFile(file);
            if (ev.target?.result) {
              setProfileImg(ev.target.result.toString());
            }
          };
          img.onerror = () => {
            showToast('손상되었거나 유효하지 않은 이미지 파일입니다.', 'error'); // alert -> toast.error
          };
          img.src = ev.target?.result as string;
        } catch {
          showToast('이미지 파일을 읽는 중 오류가 발생했습니다.', 'error'); // alert -> toast.error
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 및 전화번호 업데이트 핸들러
  const handleProfileAndPhoneUpdate = async (): Promise<void> => {
    if (!formData.phone) {
      showToast('전화번호를 입력해주세요.', 'error');
      return;
    }
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      showToast('전화번호 형식이 올바르지 않습니다.', 'error');
      return;
    }
    setPhoneLoading(true);
    setImgLoading(true);
    setMessage({ type: '', text: '' });
    let profileImgUrl = userInfo?.image || '';
    try {
      if (profileFile) {
        const formDataObj = new FormData();
        formDataObj.append('image', profileFile);
        // S3 업로드
        const res = await api.post('/api/s3/images', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        profileImgUrl = res.data?.s3Key || profileImgUrl;
      }
      await api.patch('/api/users/me', {
        phoneNum: formData.phone,
        image: profileImgUrl,
      });

      // 유저 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });


      showToast('프로필이 성공적으로 수정되었습니다.', 'success');
      // setMessage({ type: 'success', text: '프로필 사진과 전화번호가 성공적으로 수정되었습니다.' });
      setProfileFile(null);
    } catch  {
      showToast('프로필 수정에 실패했습니다.', 'error');
      // setMessage({ type: 'error', text: error?.response?.data?.message || '수정에 실패했습니다.' });
    } finally {
      setPhoneLoading(false);
      setImgLoading(false);
    }
  };

  // 로딩 중이면 스피너 표시
  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 메인 렌더링
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">

        {/* 알림 메시지 */}
        {message.text && (
          <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <Typography variant="body">{message.text}</Typography>
          </div>
        )}

        {/* 프로필 정보 섹션 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <Typography variant="titleMedium" as="h2" className="font-semibold text-gray-800 mb-4">프로필 정보</Typography>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer border-4 border-blue-50 hover:border-blue-100 transition-all mb-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-medium text-blue-500">
                      {formData.name.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleProfileImgChange}
                />
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-sm"
                >
                  <Typography variant="body" className="text-blue-500">사진 변경</Typography>
                </Button>
              </div>
              
              {/* 사용자 정보 */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">이름</Typography>
                    <div className="bg-gray-50 rounded-md py-2 px-3 text-gray-700">
                      <Typography variant="body">{formData.name}</Typography>
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">이메일</Typography>
                    <div className="bg-gray-50 rounded-md py-2 px-3 text-gray-700">
                      <Typography variant="body">{formData.email}</Typography>
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">직급</Typography>
                    <div className="bg-gray-50 rounded-md py-2 px-3 text-gray-700">
                      <Typography variant="body">{formData.position || '미설정'}</Typography>
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">부서</Typography>
                    <div className="bg-gray-50 rounded-md py-2 px-3 text-gray-700">
                      <Typography variant="body">{formData.department || '미설정'}</Typography>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">
                    전화번호 <span className="text-red-500">*</span>
                  </Typography>
                  <div className="flex items-center">
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={13}
                      inputMode="numeric"
                      placeholder="전화번호를 입력해주세요 (예: 010-1234-5678)"
                      className="w-full rounded-md"
                    />
                    
                    <Button
                      type="button"
                      size="small"
                      variant="primary"
                      onClick={handleProfileAndPhoneUpdate}
                      disabled={phoneLoading || imgLoading}
                      className="ml-3 px-5"
                    >
                      <Typography variant="body" className="text-white">
                        {(phoneLoading || imgLoading) ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>저장 중...</span>
                          </div>
                        ) : '저장'}
                      </Typography>
                    </Button>
                  </div>
                  
                  {formData.phone && !isValidPhoneNumber(formData.phone) && (
                    <div className="mt-1 flex items-center text-red-500">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <Typography variant="caption" className="text-red-500">전화번호 형식이 올바르지 않습니다.</Typography>
                    </div>
                  )}
                  
                  {formData.phone && isValidPhoneNumber(formData.phone) && (
                    <div className="mt-1 flex items-center text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <Typography variant="caption" className="text-green-500">올바른 전화번호 형식입니다.</Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <Typography variant="titleMedium" as="h2" className="font-semibold text-gray-800 mb-4">비밀번호 변경</Typography>
            
            <div className="space-y-4 max-w-md">
              <div>
                <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">
                  현재 비밀번호 <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full"
                  placeholder="현재 비밀번호 입력"
                />
              </div>
              
              <div>
                <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">
                  새 비밀번호 <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                  placeholder="새 비밀번호 입력 (8자 이상)"
                />
                <div className="mt-1 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <Typography variant="caption" className={newPassword.length >= 8 ? 'text-green-500' : 'text-gray-500'}>8자 이상</Typography>
                </div>
              </div>
              
              <div>
                <Typography variant="body" as="label" className="block font-medium text-gray-600 mb-1">
                  새 비밀번호 확인 <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  placeholder="새 비밀번호 다시 입력"
                />
                {newPassword && confirmPassword && (
                  <div className="mt-1 flex items-center">
                    <div className={`w-2 h-2 rounded-full ${newPassword === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <Typography 
                      variant="caption" 
                      className={newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}
                    >
                      {newPassword === confirmPassword ? '비밀번호 일치' : '비밀번호 불일치'}
                    </Typography>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button
                  type="button"
                  size="small"
                  variant="primary"
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  className="w-full md:w-auto px-5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <Typography variant="body" className="text-white">변경 중...</Typography>
                    </div>
                  ) : (
                    <Typography variant="body" className="text-white">비밀번호 변경</Typography>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { validateEmail } from '@/shared/utils/validation';
import { showToast } from '@/shared/components/atoms/toast';

interface MailRecipientInputProps {
  label: string;
  recipients: string[];
  onAddRecipient: (email: string) => void;
  onRemoveRecipient: (index: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  recentRecipients?: string[]; // 최근 수신자 목록 추가
}

export const MailRecipientInput: React.FC<MailRecipientInputProps> = ({
  label,
  recipients,
  onAddRecipient,
  onRemoveRecipient,
  onFocus,
  onBlur,
  recentRecipients = [] // 기본값 빈 배열
}) => {

  const [inputValue, setInputValue] = useState('');
  const [showRecentList, setShowRecentList] = useState(false);
  
  const validateAndAddRecipient = (email: string) => {
    if (!email.trim()) return;
    
    // 이메일 유효성 검사
    const validation = validateEmail(email.trim());
    if (!validation.isValid) {
      showToast(`이메일 오류: ${validation.message}`, 'error');
      return;
    }
    
    onAddRecipient(email.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndAddRecipient(inputValue);
      e.preventDefault();
    } else if (e.key === ';' || e.key === ',' || e.key === ' ') {
      // 세미콜론, 쉼표, 스페이스바로도 이메일 추가 가능
      if (inputValue.trim()) {
        validateAndAddRecipient(inputValue);
        e.preventDefault();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 입력창 포커스 이벤트 핸들러
  const handleFocus = () => {
    // 최근 수신자 목록 표시
    setShowRecentList(true);
    
    // 상위 컴포넌트로 포커스 이벤트 전달
    if (onFocus) {
      onFocus();
    }
  };

  // 입력창 블러 이벤트 핸들러
  const handleBlur = (e: React.FocusEvent) => {
    // 클릭한 요소가 최근 수신자 목록 내부인지 확인
    const isClickInsideRecentList = e.relatedTarget && 
      e.relatedTarget.closest('.recent-recipients-list');
    
    if (!isClickInsideRecentList) {
      // 최근 수신자 목록 외부 클릭 시 목록 숨김
      setShowRecentList(false);
    }
    
    // 상위 컴포넌트로 블러 이벤트 전달
    if (onBlur) {
      onBlur();
    }
    
    // 기존 블러 로직 유지
    if (inputValue.trim()) {
      validateAndAddRecipient(inputValue);
    }
  };
  
  // 최근 수신자 선택 핸들러
  const handleSelectRecentRecipient = (email: string) => {
    validateAndAddRecipient(email);
    setShowRecentList(false);
    setInputValue('')
  };

  return (
    <div className="flex items-start mb-2 relative">
      <Typography variant="body" className="w-20 pt-1 text-sm">
        {label}:
      </Typography>
      <div className="flex-1 flex flex-wrap gap-1 items-center border-b border-gray-300 py-1">
        {recipients.map((recipient, index) => (
          <div 
            key={index} 
            className="flex items-center bg-[#CDECFC] px-2 py-0.5 rounded text-sm"
          >
            <span>{recipient}</span>
            <button 
              onClick={() => onRemoveRecipient(index)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        ))}
        <input 
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={`${label} 추가...`}
          className="flex-1 outline-none min-w-[100px] text-sm h-5 py-0"
        />
        
        {/* 최근 수신자 목록 */}
        {showRecentList && recentRecipients.length > 0 && (
          <div className="absolute left-20 top-full mt-1 w-[calc(100%-5rem)] bg-white shadow-lg rounded-md border border-gray-200 z-10 recent-recipients-list">
            <ul>
              {recentRecipients.map((email, index) => (
                <li 
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectRecentRecipient(email)}
                  tabIndex={0} // 키보드 포커스 가능하도록
                >
                  {email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
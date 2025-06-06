import React, { useState, forwardRef } from 'react';
import KakaoAddressTemplate from '@/shared/components/template/kakaoAddressTemplate';
import { Input } from '@/shared/components/atoms/input';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value, onChange, placeholder = '주소를 검색하세요', className = '', onFocus, onClick }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsModalOpen(true);
      onClick?.(e as any);
    };

    return (
      <>
        <div className="flex">
          <Input
            ref={ref}
            value={value}
            readOnly
            onClick={handleClick}
            onFocus={onFocus}
            placeholder={placeholder}
            className={`cursor-pointer ${className}`}
          />
        </div>
        {isModalOpen && (
          <KakaoAddressTemplate
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={data => {
              onChange(data.address);
              setIsModalOpen(false);
            }}
          />
        )}
      </>
    );
  }
);

export default AddressInput; 
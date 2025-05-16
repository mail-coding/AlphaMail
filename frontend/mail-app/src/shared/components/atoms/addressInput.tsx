import React, { useState } from 'react';
import KakaoAddressTemplate from '@/shared/components/template/kakaoAddressTemplate';
import { Input } from '@/shared/components/atoms/input';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = '주소를 검색하세요',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex">
        <Input
          value={value}
          readOnly
          onClick={handleClick}
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
};

export default AddressInput; 
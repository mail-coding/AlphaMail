import React from 'react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearchClick: () => void;
  placeholder?: string;
  className?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onSearchClick,
  placeholder = '주소를 검색하세요',
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSearchClick();
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={value}
        onClick={handleClick}
        readOnly
        placeholder={placeholder}
        className={`flex-1 border border-gray-300 rounded-l-md shadow-sm p-2 cursor-pointer hover:bg-gray-50 ${className}`}
      />
    </div>
  );
};

export default AddressInput; 
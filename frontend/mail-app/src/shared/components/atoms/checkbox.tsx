import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  onClick,
  disabled = false,
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      disabled={disabled}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
  );
}; 
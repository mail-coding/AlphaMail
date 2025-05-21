import React, { useState, forwardRef } from 'react';
import { Client } from '../../../features/work/types/clients';
import { ClientSelectTemplate } from '../../../features/work/components/clients/templates/clientSelectTemplate';

interface ClientInputProps {
  value: string;
  onChange: (client: Client) => void;
  placeholder?: string;
  className?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  preventFormSubmit?: boolean;
}

const ClientInput = forwardRef<HTMLInputElement, ClientInputProps>(
  ({ value, onChange, placeholder = '거래처를 검색하세요', className = '', onFocus, onClick }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelect = (client: Client) => {
      onChange(client);
      setIsModalOpen(false);
    };

    return (
      <>
        <input
          ref={ref}
          type="text"
          value={value}
          onClick={e => {
            setIsModalOpen(true);
            onClick?.(e);
          }}
          onFocus={onFocus}
          readOnly
          placeholder={placeholder}
          className={`w-full border border-gray-300 shadow-sm p-2 cursor-pointer hover:bg-gray-50 ${className}`}
        />
        <ClientSelectTemplate
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelect}
        />
      </>
    );
  }
);

export default ClientInput; 
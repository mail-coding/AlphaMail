import React, { useState } from 'react';
import { Client } from '../../../features/work/types/clients';
import { ClientSelectTemplate } from '../../../features/work/components/clients/templates/clientSelectTemplate';

interface ClientInputProps {
  value: string;
  onChange: (client: Client) => void;
  placeholder?: string;
  className?: string;
}

const ClientInput: React.FC<ClientInputProps> = ({
  value,
  onChange,
  placeholder = '거래처를 검색하세요',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (client: Client) => {
    onChange(client);
    setIsModalOpen(false);
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onClick={() => setIsModalOpen(true)}
        readOnly
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md shadow-sm p-2 cursor-pointer hover:bg-gray-50 ${className}`}
      />
      <ClientSelectTemplate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
};

export default ClientInput; 
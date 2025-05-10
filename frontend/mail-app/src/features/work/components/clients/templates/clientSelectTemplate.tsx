import React, { useState } from 'react';
import { Client } from '../../../types/clients';
import { ClientSearchBar } from '../molecules/clientSearchBar';
import { ClientSelectTable } from '../organisms/clientSelectTable';
import { useClientsSelectQuery } from '../../../hooks/useClientsSelectQuery';

interface ClientSelectTemplateProps {
  isOpen: boolean;
  onSelect: (client: Client) => void;
  onClose: () => void;
}

export const ClientSelectTemplate: React.FC<ClientSelectTemplateProps> = ({
  isOpen, onSelect, onClose
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data } = useClientsSelectQuery({
    companyId: 1, // TODO : 회사 아이디 받아오기
    query: searchKeyword,
    page: currentPage,
    size: pageSize,
  });

  if (!isOpen) return null;

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleSelect = () => {
    const client = data?.contents.find((c) => c.id === selectedId);
    if (client) onSelect(client);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
      {/* 모달 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">거래처 선택</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="p-4">
          <div className="mb-2">
            <ClientSearchBar onSearch={handleSearch} />
          </div>
          <ClientSelectTable
            clients={data?.contents || []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded"
              disabled={selectedId === null}
              onClick={handleSelect}
            >
              선택
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
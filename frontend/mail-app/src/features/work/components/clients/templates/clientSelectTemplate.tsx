import React, { useState } from 'react';
import { Client } from '../../../types/clients';
import { ClientSearchBar } from '../molecules/clientSearchBar';
import { ClientSelectTable } from '../organisms/clientSelectTable';
import { useClientsSelectQuery } from '../../../hooks/useClientsSelectQuery';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';

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
      <div className="fixed inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-[800px] h-[600px] mx-4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <Typography variant="titleMedium">거래처 선택</Typography>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          <ClientSearchBar onSearch={handleSearch} />
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <ClientSelectTable
              clients={data?.contents || []}
              selectedId={selectedId}
              onSelect={setSelectedId}
              page={currentPage}
              pageCount={data ? Math.ceil(data.totalCount / pageSize) : 1}
              onPageChange={setCurrentPage}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              disabled={selectedId === null}
              onClick={handleSelect}
            >
              선택
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { ClientTable } from '../organisms/clientTable';
import { ClientSearchBar } from '../organisms/clientSearchBar';
import { ClientDetailTemplate } from './clientDetailTemplate';
import { Client } from '../../../types/clients';
import { useClientsManagementQuery } from '../../../hooks/useClientsManagementQuery';
import { clientService } from '../../../services/clientService';

export const ClientManagementTemplate: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [showDetail, setShowDetail] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data, refetch } = useClientsManagementQuery({
    companyId: 1,
    query: searchKeyword,
    page: currentPage,
    size: pageSize,
  });

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (selectedClientIds.size === 0) {
      alert('삭제할 거래처를 선택해주세요.');
      return;
    }
    if (!window.confirm('선택한 거래처를 삭제하시겠습니까?')) return;
    try {
      await clientService.deleteClients(Array.from(selectedClientIds));
      setSelectedClientIds(new Set());
      refetch();
      alert('선택한 거래처가 삭제되었습니다.');
    } catch (error) {
      alert('거래처 삭제에 실패했습니다.');
    }
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowDetail(true);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setShowDetail(true);
  };

  const handleDetailCancel = () => {
    setShowDetail(false);
    setSelectedClient(null);
  };

  const handleDetailSave = (_data: Partial<Client>) => {
    setShowDetail(false);
    setSelectedClient(null);
    refetch();
  };

  if (showDetail) {
    return (
      <ClientDetailTemplate
        client={selectedClient || undefined}
        onSave={handleDetailSave}
        onCancel={handleDetailCancel}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <ClientSearchBar
          onSearch={handleSearch}
        />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handleAddClient}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              거래처 등록
            </button>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                출력
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
              >
                삭제
              </button>
            </div>
          </div>
          <ClientTable
            clients={data?.contents || []}
            currentPage={currentPage}
            pageSize={pageSize}
            selectedClientIds={selectedClientIds}
            onSelectClient={(id) => {
              setSelectedClientIds((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(id)) newSet.delete(id);
                else newSet.add(id);
                return newSet;
              });
            }}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            totalCount={data?.totalCount || 0}
            pageCount={data?.pageCount || 0}
            onClientClick={handleClientClick}
          />
        </div>
      </div>
    </div>
  );
};
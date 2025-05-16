import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientTable } from '../organisms/clientTable';
import { ClientSearchBar } from '../organisms/clientSearchBar';
import { Client } from '../../../types/clients';
import { useClients } from '../../../hooks/useClients';
import { useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';

export const ClientManagementTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());

  const { data, refetch } = useClients({
    query: searchKeyword,
    page: currentPage,
    size: pageSize,
  });

  const queryClient = useQueryClient();

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
    navigate('/work/clients/new');
  };

  const handleClientClick = (client: Client) => {
    queryClient.invalidateQueries({ queryKey: ['client', client.id] });
    navigate(`/work/clients/${client.id}`);
  };

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
            <Button
              onClick={handleAddClient}
              variant="text"
              size="large"
              className="flex items-baseline gap-2 p-0 bg-transparent shadow-none border-none text-black font-bold text-xl hover:bg-transparent hover:text-black active:bg-transparent"
            >
              <span className="text-2xl font-bold leading-none relative -top-[-1px]">+</span>
              <Typography variant="titleSmall" className="leading-none">거래처 등록하기</Typography>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                variant="text"
                size="small"
                className="min-w-[110px] h-[40px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
              >
                <Typography variant="titleSmall">삭제</Typography>
              </Button>
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
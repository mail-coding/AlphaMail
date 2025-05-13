import React, { useState } from 'react';
import { ClientTable } from '../organisms/clientTable';
import { ClientSearchBar } from '../organisms/clientSearchBar';
import { ClientDetailTemplate } from './clientDetailTemplate';
import { Client } from '../../../types/clients';
import { useClients } from '../../../hooks/useClients';
import { useClient } from '../../../hooks/useClient';
import { useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';
import { Spinner } from '@/shared/components/atoms/spinner';

export const ClientManagementTemplate: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [showDetail, setShowDetail] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const { data, refetch } = useClients({
    query: searchKeyword,
    page: currentPage,
    size: pageSize,
  });

  const { data: clientDetail, isLoading: isLoadingDetail } = useClient(selectedClientId);

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
    setSelectedClientId(null);
    setShowDetail(true);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClientId(client.id);
    setShowDetail(true);
    queryClient.invalidateQueries({ queryKey: ['client', client.id] });
  };

  const handleDetailCancel = () => {
    setShowDetail(false);
    setSelectedClientId(null);
  };

  const handleDetailSave = (_data: Partial<Client>) => {
    setShowDetail(false);
    setSelectedClientId(null);
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    queryClient.invalidateQueries({ queryKey: ['client'] });
  };

  if (showDetail) {
    if (isLoadingDetail) {
      return (
        <div className="p-8 text-center">
          <Spinner size="large" />
          <Typography variant="body" className="mt-4">
            로딩중...
          </Typography>
        </div>
      );
    }
    return (
      <ClientDetailTemplate
        client={clientDetail}
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
            <Button
              onClick={handleAddClient}
              variant="primary"
              size="large"
            >
              거래처 등록
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="large"
              >
                출력
              </Button>
              <Button
                onClick={handleDelete}
                variant="secondary"
                size="large"
              >
                삭제
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
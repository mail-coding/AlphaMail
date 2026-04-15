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
import { showToast } from '@/shared/components/atoms/toast';
import { WarningModal } from '@/shared/components/warningModal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
export const ClientManagementTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      showToast('삭제할 거래처를 선택해주세요.', 'error');
      return;
    }
    // 모달 열기
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 처리 함수
  const confirmDelete = async () => {
    try {
      await clientService.deleteClients(Array.from(selectedClientIds));
      setSelectedClientIds(new Set());
      refetch();
      showToast('선택한 거래처가 삭제되었습니다.', 'success');
    } catch {
      showToast('거래처 삭제를 실패했습니다.', 'error');
    } finally {
      // 모달 닫기
      setIsDeleteModalOpen(false);
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
    <>
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
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg "
              type="button"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E0EBFB]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#4885F9" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </span>
              <Typography variant="titleSmall">거래처 등록</Typography>
            </button>

              <div className="flex gap-2">
                <Button
                  onClick={handleDelete}
                  variant="text"
                  size="small"
                  className="min-w-[80px] h-[30px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
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

      {/* 삭제 확인 모달 추가 */}
      <WarningModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-500" />}
        title={<Typography variant="titleMedium">거래처 삭제</Typography>}
        description={
          <Typography variant="body">
            선택한 {selectedClientIds.size}개의 거래처를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Typography>
        }
        actions={
          <>
            <Button
              variant="text"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              삭제
            </Button>
          </>
        }
      />
    </>
  );
};
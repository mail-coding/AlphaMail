import React, { useState } from 'react';
import { AiAssistantRowTag } from '../molecules/aiAssistantRowTag';
import { AiAssistantRowDate } from '../molecules/aiAssistantRowDate';
import { AiAssistantRowTitle } from '../molecules/aiAssistantRowTitle';
import { AiAssistantRowButton } from '../molecules/aiAssistantRowButton';
import { RowTmpMail } from './rowTmpMail';
import { RowTmpScheduleAdd } from './rowTmpScheduleAdd';
import { RowTmpClientsAdd } from './rowTmpClientsAdd';
import { RowTmpOrderAdd } from './rowTmpOrderAdd';
import { RowTmpQuotesAdd } from './rowTmpQuotesAdd';
import { useHomeStore } from '../../stores/useHomeStore';
import { AssistantType } from '../../types/home';
import { assistantTypeMap } from '../../types/home';
import { useHome } from '../../hooks/useHome';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { WarningModal } from '@/shared/components/warningModal';

interface AiAssistantRowProps {
  id: string;
  type: keyof typeof assistantTypeMap;
  title: string;
  date?: string;
}

export const AiAssistantRow: React.FC<AiAssistantRowProps> = ({
  id,
  type,
  title,
  date,
}) => {
  const { activeRowId, activeRowType, setActiveRow } = useHomeStore();
  const { useDeleteAssistant } = useHome();
  const deleteAssistantMutation = useDeleteAssistant();
  const isOpen = activeRowId === id && activeRowType === type;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const handleView = (rowId: string) => {
    // 이미 열려있는 경우 닫기
    if (activeRowId === rowId && activeRowType === type) {
      setActiveRow(null, null);
    } else {
      // 다른 행이 열려있으면 닫고 현재 행 열기
      setActiveRow(rowId, type as AssistantType);
    }
  };

  const handleDelete = (rowId: string) => {
    // 삭제할 행 ID 저장하고 모달 열기
    setRowToDelete(rowId);
    setIsDeleteModalOpen(true);
  };
  
  // 실제 삭제 처리 함수
  const confirmDelete = () => {
    if (rowToDelete) {
      deleteAssistantMutation.mutate({ 
        id: Number(rowToDelete), 
        type 
      });
      // 모달 닫기
      setIsDeleteModalOpen(false);
      setRowToDelete(null);
    }
  };

  const renderDetailContent = () => {
    const typeLabel = assistantTypeMap[type as AssistantType];
    
    switch (typeLabel) {
      case '일정':
        return <RowTmpScheduleAdd temporaryScheduleId={Number(id)} />;
      case '거래처':
        return <RowTmpClientsAdd temporaryClientId={Number(id)} />;
      case '발주서':
        return <RowTmpOrderAdd temporaryPurchaseOrderId={Number(id)} />;
      case '견적서':
        return <RowTmpQuotesAdd temporaryQuoteId={Number(id)}/>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="border-t border-gray-100 py-3">
        {/* 기존 코드 유지 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AiAssistantRowTag type={assistantTypeMap[type as AssistantType]} />
            <AiAssistantRowTitle title={title} />
          </div>
          <div className="flex items-center space-x-4">
            {date && <AiAssistantRowDate date={date} />}
            <AiAssistantRowButton
              id={id}
              isOpen={isOpen}
              onView={handleView}
              onDelete={handleDelete}
            />
          </div>
        </div>
        
        {/* 상세 내용 (열려있을 때만 표시) */}
        {isOpen && (
          <div className="space-y-3">
            <RowTmpMail 
            type={type as AssistantType}
            id={Number(id)}
            />
            {renderDetailContent()}
          </div>
        )}
      </div>
      
      {/* 삭제 확인 모달 추가 */}
      <WarningModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-500" />}
        title={<Typography variant="titleMedium">항목 삭제</Typography>}
        description={
          <Typography variant="body">
            이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
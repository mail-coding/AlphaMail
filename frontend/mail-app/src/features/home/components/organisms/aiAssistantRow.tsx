import React from 'react';
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
    // 확인 대화상자 표시
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      deleteAssistantMutation.mutate({ 
        id: Number(rowId), 
        type 
      });
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
    <div className="border-t border-gray-100 py-3">
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
  );
};
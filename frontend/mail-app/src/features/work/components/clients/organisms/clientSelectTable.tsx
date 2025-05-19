import React from 'react';
import { Client } from '../../../types/clients';
import { ClientSelectTableRow } from '../molecules/clientSelectTableRow';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';

interface ClientSelectTableProps {
  clients: Client[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

export const ClientSelectTable: React.FC<ClientSelectTableProps> = ({
  clients, selectedId, onSelect, page = 1, pageCount = 1, onPageChange = () => {}
}) => (
  <div className="relative h-full flex flex-col">
    <div className="border-t-2 border-gray-400 rounded-t-md"></div>
    <div className="flex-1 overflow-auto">
      <table className="min-w-0 w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 first:border-l-0 last:border-r-0"></th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"><Typography variant="body">거래처코드</Typography></th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"><Typography variant="body">거래처명</Typography></th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"><Typography variant="body">대표자명</Typography></th>
            <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"><Typography variant="body">사업자 번호</Typography></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientSelectTableRow
                key={client.id}
                client={client}
                selected={selectedId === client.id}
                onSelect={onSelect}
                withColBorder
                tdPadding="px-2 py-2"
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">거래처가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {/* Pagination */}
    <div className="flex justify-center items-center mt-2 mb-1">
      <Button
        variant="ghost"
        size="small"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        &lt;
      </Button>
      {[...Array(pageCount)].map((_, i) => (
        <Button
          key={i}
          variant="ghost"
          size="small"
          onClick={() => onPageChange(i + 1)}
          className={page === i + 1 ? 'font-bold underline' : ''}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="small"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        &gt;
      </Button>
    </div>
  </div>
); 
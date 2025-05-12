import React from 'react';
import { Client } from '../../../types/clients';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';

interface ClientTableProps {
  clients: Client[];
  currentPage: number;
  pageSize: number;
  selectedClientIds: Set<number>;
  onSelectClient: (id: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  totalCount: number;
  pageCount: number;
  onClientClick?: (client: Client) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  currentPage,
  pageSize,
  selectedClientIds,
  onSelectClient,
  setCurrentPage,
  setPageSize,
  totalCount,
  pageCount,
  onClientClick,
}) => {
  return (
    <div>
      <table className="min-w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">
              <Typography variant="body" bold>선택</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>순번</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>거래처명</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>대표자명</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>사업자 번호</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>전화번호</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>Email</Typography>
            </th>
            <th className="p-2">
              <Typography variant="body" bold>주소</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients?.length > 0 ? (
            clients.map((client, idx) => (
              <tr key={client.id} className="border-t hover:bg-gray-50">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedClientIds.has(client.id)}
                    onChange={() => onSelectClient(client.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-2 text-center">
                  <Typography variant="body">
                    {String(idx + 1).padStart(4, '0')}
                  </Typography>
                </td>
                <td className="p-2">
                  {onClientClick ? (
                    <Button
                      variant="text"
                      onClick={() => onClientClick(client)}
                      className="text-left hover:text-blue-600 hover:underline"
                    >
                      <Typography variant="body">
                        {client.corpName}
                      </Typography>
                    </Button>
                  ) : (
                    <Typography variant="body">
                      {client.corpName}
                    </Typography>
                  )}
                </td>
                <td className="p-2">
                  <Typography variant="body">
                    {client.representative}
                  </Typography>
                </td>
                <td className="p-2">
                  <Typography variant="body">
                    {client.licenseNumber}
                  </Typography>
                </td>
                <td className="p-2">
                  <Typography variant="body">
                    {client.phoneNumber}
                  </Typography>
                </td>
                <td className="p-2">
                  <Typography variant="body">
                    {client.email}
                  </Typography>
                </td>
                <td className="p-2">
                  <Typography variant="body">
                    {client.address}
                  </Typography>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-4 text-center">
                <Typography variant="body" color="text-gray-500">
                  거래처가 없습니다.
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &lt;
        </Button>
        {[...Array(pageCount)].map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="small"
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'font-bold underline' : ''}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="small"
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          &gt;
        </Button>
        <select 
          value={pageSize} 
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="ml-4 border rounded p-1"
        >
          <option value="10">10개</option>
          <option value="20">20개</option>
          <option value="50">50개</option>
        </select>
        <Typography variant="body" className="ml-4">
          총 {totalCount}개
        </Typography>
      </div>
    </div>
  );
};
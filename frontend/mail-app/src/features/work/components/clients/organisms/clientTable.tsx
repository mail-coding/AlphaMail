import React from 'react';
import { Client } from '../../../types/clients';

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
            <th className="p-2">선택</th>
            <th className="p-2">순번</th>
            <th className="p-2">거래처명</th>
            <th className="p-2">대표자명</th>
            <th className="p-2">사업자 번호</th>
            <th className="p-2">전화번호</th>
            <th className="p-2">Email</th>
            <th className="p-2">주소</th>
          </tr>
        </thead>
        <tbody>
          {clients?.length > 0 ? (
            clients.map((client, idx) => (
              <tr key={client.id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedClientIds.has(client.id)}
                    onChange={() => onSelectClient(client.id)}
                  />
                </td>
                <td className="p-2 text-center">{String(idx + 1).padStart(4, '0')}</td>
                <td className="p-2">
                  {onClientClick ? (
                    <button
                      type="button"
                      className="text-left hover:text-blue-600 hover:underline"
                      onClick={() => onClientClick(client)}
                    >
                      {client.corpName}
                    </button>
                  ) : (
                    client.corpName
                  )}
                </td>
                <td className="p-2">{client.representative}</td>
                <td className="p-2">{client.licenseNumber}</td>
                <td className="p-2">{client.phoneNumber}</td>
                <td className="p-2">{client.email}</td>
                <td className="p-2">{client.address}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-4 text-center">
                거래처가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-2"
        >
          &lt;
        </button>
        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 ${currentPage === i + 1 ? 'font-bold underline' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === pageCount}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-2"
        >
          &gt;
        </button>
        <select 
          value={pageSize} 
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="ml-4 border rounded p-1"
        >
          <option value="10">10개</option>
          <option value="20">20개</option>
          <option value="50">50개</option>
        </select>
        <span className="ml-4">총 {totalCount}개</span>
      </div>
    </div>
  );
};
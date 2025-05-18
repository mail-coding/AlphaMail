import React from 'react';
import { Typography } from './Typography';

interface Column {
  header: string | React.ReactNode;
  accessor: string;
  width: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onSizeChange: (size: number) => void;
  totalCount: number;
  sortOption: number;
  onSortChange: (option: number) => void;
  renderCell: (column: Column, row: any) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onSizeChange,
  totalCount,
  renderCell,
}) => {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className="border border-gray-200 p-2 text-left"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="border border-gray-200 p-2">
                  {renderCell(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded p-1"
          >
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
          </select>
          <Typography variant="body">
            총 {totalCount}개 중 {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalCount)}개
          </Typography>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 
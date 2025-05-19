import React from 'react';
import { Client } from '../../../types/clients';
import { Typography } from '@/shared/components/atoms/Typography';

interface ClientSelectTableRowProps {
  client: Client;
  selected: boolean;
  onSelect: (id: number) => void;
  withColBorder?: boolean;
  tdPadding?: string;
}

export const ClientSelectTableRow: React.FC<ClientSelectTableRowProps> = ({
  client, selected, onSelect, withColBorder, tdPadding
}) => {
  const tdClass = (isLast: boolean) =>
    `${tdPadding ?? 'p-2'} text-center${withColBorder && !isLast ? ' border-r border-gray-200' : ''}`;
  return (
    <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => onSelect(client.id)}>
      <td className={tdClass(false)}>
        <input
          type="radio"
          checked={selected}
          onChange={() => onSelect(client.id)}
        />
      </td>
      <td className={tdClass(false)}><Typography variant="body">{String(client.id).padStart(4, '0')}</Typography></td>
      <td className={tdClass(false)}><Typography variant="body">{client.corpName}</Typography></td>
      <td className={tdClass(false)}><Typography variant="body">{client.representative}</Typography></td>
      <td className={tdClass(true)}><Typography variant="body">{client.licenseNumber}</Typography></td>
    </tr>
  );
}; 
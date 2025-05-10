import React from 'react';
import { Client } from '../../../types/clients';

interface ClientSelectTableRowProps {
  client: Client;
  selected: boolean;
  onSelect: (id: number) => void;
}

export const ClientSelectTableRow: React.FC<ClientSelectTableRowProps> = ({
  client, selected, onSelect
}) => (
  <tr>
    <td className="text-center">
      <input
        type="radio"
        checked={selected}
        onChange={() => onSelect(client.id)}
      />
    </td>
    <td className="text-center">{String(client.id).padStart(4, '0')}</td>
    <td>{client.corpName}</td>
    <td>{client.representative}</td>
    <td>{client.licenseNumber}</td>
  </tr>
); 
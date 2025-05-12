import React from 'react';
import { Client } from '../../../types/clients';
import { Typography } from '@/shared/components/atoms/Typography';
import { Button } from '@/shared/components/atoms/button';

interface ClientTableRowProps {
  client: Client;
  onSelect: (id: number) => void;
  onClientClick?: (client: Client) => void;
}

export const ClientTableRow: React.FC<ClientTableRowProps> = ({
  client,
  onSelect,
  onClientClick,
}) => {
  return (
    <tr className={`border-b hover:bg-gray-50 ${client.isSelected ? 'bg-blue-50' : ''}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={client.isSelected}
          onChange={() => onSelect(client.id)}
          className="rounded border-gray-300"
        />
      </td>
      <td className="p-4">
        <Typography variant="body">
          {client.id}
        </Typography>
      </td>
      <td className="p-4">
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
      <td className="p-4">
        <Typography variant="body">
          {client.representative}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="body">
          {client.licenseNumber}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="body">
          {client.phoneNumber}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="body">
          {client.email}
        </Typography>
      </td>
      <td className="p-4">
        <Typography variant="body">
          {client.address}
        </Typography>
      </td>
    </tr>
  );
}; 
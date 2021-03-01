import React, { FC, useMemo, useState } from 'react';
import { Column } from 'react-table';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { Messages } from './BackupInventory.messages';
import { Backup } from './BackupInventory.types';

const { columns, noData } = Messages;
const { name, created, location } = columns;

export const BackupInventory: FC = () => {
  const [pending] = useState(true);
  const [data] = useState<Backup[]>([]);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        width: '150px',
      },
      {
        Header: created,
        accessor: 'created',
      },
      {
        Header: location,
        accessor: 'location',
      },
    ],
    []
  );

  return (
    <Table
      data={data}
      totalItems={data.length}
      columns={columns}
      emptyMessage={noData}
      pendingRequest={pending}
    ></Table>
  );
};

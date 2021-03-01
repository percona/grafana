import React, { FC, useMemo, useState } from 'react';
import { Column } from 'react-table';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { BackupCreation } from './BackupCreation';
import { Messages } from './BackupInventory.messages';
import { Backup } from './BackupInventory.types';

const { columns, noData } = Messages;
const { name, created, location } = columns;

export const BackupInventory: FC = () => {
  const [pending] = useState(false);
  const [data] = useState<Backup[]>([
    {
      name: 'pg-sales-ncarolina-prod-10',
      created: Date.now(),
      location: 'postgresql-sles-production',
    },
  ]);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        width: '250px',
      },
      {
        Header: created,
        accessor: 'created',
        Cell: ({ value }) => <BackupCreation date={value} />,
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

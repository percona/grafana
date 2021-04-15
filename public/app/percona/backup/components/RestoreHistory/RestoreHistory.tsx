import React, { FC, useState, useMemo } from 'react';
import { Column } from 'react-table';
import { Messages as BackupMessages } from '../BackupInventory/BackupInventory.messages';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { BackupCreation } from '../BackupInventory/BackupCreation';
import { Restore } from './RestoreHistory.types';

const { columns, noData } = BackupMessages;
const { name, created, location, vendor } = columns;

export const RestoreHistory: FC = () => {
  const [data] = useState<Restore[]>([]);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'name',
        width: '250px',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: vendor,
        accessor: ({ vendor }: Restore) => DATABASE_LABELS[vendor],
        width: '150px',
      },
      {
        Header: created,
        accessor: 'created',
        Cell: ({ value }) => <BackupCreation date={value} />,
      },
      {
        Header: location,
        accessor: 'locationName',
      },
    ],
    []
  );
  return <Table columns={columns} data={data} totalItems={data.length} emptyMessage={noData} />;
};

import { Table } from 'app/percona/integrated-alerting/components/Table';
import React, { FC, useState, useMemo } from 'react';
import { Column } from 'react-table';
import { Messages } from '../../Backup.messages';
import { ScheduledBackup } from './ScheduledBackups.types';

export const ScheduledBackups: FC = () => {
  const [data] = useState<ScheduledBackup[]>([]);
  const [pending] = useState(false);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: Messages.scheduledBackups.table.columns.name,
        accessor: 'name',
      },
      {
        Header: Messages.scheduledBackups.table.columns.vendor,
        accessor: 'vendor',
      },
      {
        Header: Messages.scheduledBackups.table.columns.start,
        accessor: 'start',
      },
      {
        Header: Messages.scheduledBackups.table.columns.retention,
        accessor: 'retention',
      },
      {
        Header: Messages.scheduledBackups.table.columns.frequency,
        accessor: 'frequency',
      },
      {
        Header: Messages.scheduledBackups.table.columns.location,
        accessor: 'location',
      },
    ],
    []
  );
  return (
    <Table
      columns={columns}
      data={data}
      totalItems={data.length}
      emptyMessage={Messages.scheduledBackups.table.noData}
      pendingRequest={pending}
    />
  );
};

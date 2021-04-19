import React, { FC, useState, useMemo, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { Status } from '../Status';
import { Messages } from '../../Backup.messages';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { DetailedDate } from '../DetailedDate';
import { Restore } from './RestoreHistory.types';
import { RestoreHistoryService } from './RestoreHistory.service';
import { logger } from '@percona/platform-core';
import { RestoreHistoryDetails } from './RestoreHistoryDetails';

export const RestoreHistory: FC = () => {
  const [pending, setPending] = useState(false);
  const [data, setData] = useState<Restore[]>([]);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: Messages.backupInventory.table.columns.name,
        accessor: 'name',
        id: 'name',
        width: '250px',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: Messages.backupInventory.table.columns.vendor,
        accessor: ({ vendor }: Restore) => DATABASE_LABELS[vendor],
        width: '150px',
      },
      {
        Header: Messages.restoreHistory.table.columns.started,
        accessor: 'started',
        Cell: ({ value }) => <DetailedDate date={value} />,
      },
      {
        Header: Messages.backupInventory.table.columns.location,
        accessor: 'locationName',
      },
      {
        Header: Messages.backupInventory.table.columns.status,
        accessor: 'status',
        Cell: ({ value }) => <Status status={value} />,
      },
    ],
    []
  );

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Restore>) => (
      <RestoreHistoryDetails
        name={row.original.name}
        finished={row.original.finished}
        dataModel={row.original.dataModel}
      />
    ),
    []
  );

  const getData = async () => {
    setPending(true);

    try {
      const restores = await RestoreHistoryService.list();
      setData(restores);
    } catch (e) {
      logger.error(e);
    }
    setPending(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Table
      columns={columns}
      data={data}
      totalItems={data.length}
      emptyMessage={Messages.restoreHistory.table.noData}
      pendingRequest={pending}
      renderExpandedRow={renderSelectedSubRow}
    />
  );
};

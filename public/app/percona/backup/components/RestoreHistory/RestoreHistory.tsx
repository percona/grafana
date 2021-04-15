import React, { FC, useState, useMemo, useEffect } from 'react';
import { Column } from 'react-table';
import { Messages as BackupMessages } from '../BackupInventory/BackupInventory.messages';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { BackupCreation } from '../BackupInventory/BackupCreation';
import { Restore } from './RestoreHistory.types';
import { RestoreHistoryService } from './RestoreHistory.service';
import { logger } from '@percona/platform-core';
import { RestoreHistoryActions } from './RestoreHistoryActions';

const { columns, noData } = BackupMessages;
const { name, created, location, vendor, actions } = columns;

export const RestoreHistory: FC = () => {
  const [pending, setPending] = useState(false);
  const [, setSelectedRestore] = useState<Restore | null>(null);
  const [data, setData] = useState<Restore[]>([]);
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
      {
        Header: actions,
        accessor: 'id',
        Cell: ({ row }) => (
          <RestoreHistoryActions
            restore={row.original as Restore}
            onCancel={onCancelClick}
            onRestore={onRestoreClick}
            onDelete={onDeleteClick}
          />
        ),
        width: '150px',
      },
    ],
    []
  );

  const onCancelClick = (restore: Restore) => {
    setSelectedRestore(restore);
  };

  const onRestoreClick = (restore: Restore) => {
    setSelectedRestore(restore);
  };

  const onDeleteClick = (restore: Restore) => {
    setSelectedRestore(restore);
  };

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
    <Table columns={columns} data={data} totalItems={data.length} emptyMessage={noData} pendingRequest={pending} />
  );
};

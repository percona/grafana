import React, { FC, useState, useMemo, useEffect } from 'react';
import { Column } from 'react-table';
import { Messages as BackupMessages } from '../BackupInventory/BackupInventory.messages';
import { Status } from '../BackupInventory/Status';
import { Messages as RestoreMessages } from './RestoreHistory.messages';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { BackupCreation } from '../BackupInventory/BackupCreation';
import { Restore } from './RestoreHistory.types';
import { RestoreHistoryService } from './RestoreHistory.service';
import { logger } from '@percona/platform-core';

const { columns: backupColumns } = BackupMessages;
const { columns: restoreColumns, noData } = RestoreMessages;
const { name, location, vendor } = backupColumns;
const { started } = restoreColumns;

export const RestoreHistory: FC = () => {
  const [pending, setPending] = useState(false);
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
        Header: started,
        accessor: 'started',
        Cell: ({ value }) => <BackupCreation date={value} />,
      },
      {
        Header: location,
        accessor: 'locationName',
      },
      {
        Header: status,
        accessor: 'status',
        Cell: ({ value }) => <Status status={value} />,
      },
    ],
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
    <Table columns={columns} data={data} totalItems={data.length} emptyMessage={noData} pendingRequest={pending} />
  );
};

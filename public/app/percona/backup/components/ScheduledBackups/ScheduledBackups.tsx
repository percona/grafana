import React, { FC, useState, useMemo, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { Messages } from '../../Backup.messages';
import { DetailedDate } from '../DetailedDate';
import { ScheduledBackup } from './ScheduledBackups.types';
import { ScheduledBackupsService } from './ScheduledBackups.service';
import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from './ScheduledBackups.constants';
import { ScheduledBackupDetails } from './ScheduledBackupsDetails';

export const ScheduledBackups: FC = () => {
  const [data, setData] = useState<ScheduledBackup[]>([]);
  const [pending, setPending] = useState(false);
  const [generateToken] = useCancelToken();
  const columns = useMemo(
    (): Array<Column<ScheduledBackup>> => [
      {
        Header: Messages.scheduledBackups.table.columns.name,
        accessor: 'name',
        id: 'name',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: Messages.scheduledBackups.table.columns.vendor,
        accessor: 'vendor',
        Cell: ({ value }) => DATABASE_LABELS[value],
      },
      {
        Header: Messages.scheduledBackups.table.columns.frequency,
        accessor: 'cronExpression',
      },
      {
        Header: Messages.scheduledBackups.table.columns.type,
        accessor: 'type',
      },
      {
        Header: Messages.scheduledBackups.table.columns.location,
        accessor: 'locationName',
      },
      {
        Header: Messages.scheduledBackups.table.columns.lastBackup,
        accessor: 'lastBackup',
        Cell: ({ value }) => <DetailedDate date={value} />,
      },
    ],
    []
  );

  const getData = async () => {
    setPending(true);
    try {
      const backups = await ScheduledBackupsService.list(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN));
      setData(backups);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPending(false);
  };

  const renderSelectedSubRow = React.useCallback(
    (row: Row<ScheduledBackup>) => (
      <ScheduledBackupDetails
        name={row.original.name}
        dataModel={row.original.dataModel}
        description={row.original.description}
      />
    ),
    []
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      totalItems={data.length}
      emptyMessage={Messages.scheduledBackups.table.noData}
      pendingRequest={pending}
      renderExpandedRow={renderSelectedSubRow}
    />
  );
};

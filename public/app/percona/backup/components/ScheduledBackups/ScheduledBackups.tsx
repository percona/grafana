import React, { FC, useState, useMemo, useEffect } from 'react';
import { Column } from 'react-table';
import { logger } from '@percona/platform-core';
import moment from 'moment/moment';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { Messages } from '../../Backup.messages';
import { DetailedDate } from '../DetailedDate';
import { ScheduledBackup } from './ScheduledBackups.types';
import { ScheduledBackupsService } from './ScheduledBackups.service';
import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from './ScheduledBackups.constants';

export const ScheduledBackups: FC = () => {
  const [data, setData] = useState<ScheduledBackup[]>([]);
  const [pending] = useState(false);
  const [generateToken] = useCancelToken();
  const columns = useMemo(
    (): Array<Column<ScheduledBackup>> => [
      {
        Header: Messages.scheduledBackups.table.columns.name,
        accessor: 'name',
      },
      {
        Header: Messages.scheduledBackups.table.columns.vendor,
        accessor: 'vendor',
        Cell: ({ value }) => DATABASE_LABELS[value],
      },
      {
        Header: Messages.scheduledBackups.table.columns.start,
        accessor: 'start',
        Cell: ({ value }) => moment(value).format('HH[:]mm[:]ss'),
      },
      {
        Header: Messages.scheduledBackups.table.columns.retention,
        accessor: 'retention',
        Cell: ({ value }) => `${value.daily} / ${value.weekly}`,
      },
      {
        Header: Messages.scheduledBackups.table.columns.frequency,
        accessor: 'frequency',
        Cell: ({ value }) => `${value.value} ${value.unit}`,
      },
      {
        Header: Messages.scheduledBackups.table.columns.location,
        accessor: 'location',
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
    try {
      const backups = await ScheduledBackupsService.list(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN));
      setData(backups);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
  };

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
    />
  );
};

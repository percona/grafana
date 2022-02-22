import React, { FC, useCallback, useEffect, useState } from 'react';
import { Column } from 'react-table';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { DATA_INTERVAL, LIST_TICKETS_CANCEL_TOKEN, PAGE_MODEL } from './Tickets.constants';
import { logger } from '@percona/platform-core';
import { Table } from '../integrated-alerting/components/Table';
import { isApiCancelError } from '../shared/helpers/api';
import { useCancelToken } from '../shared/components/hooks/cancelToken.hook';
import { TicketsService } from './Tickets.service';
import { Ticket } from './Tickets.types';
import { useRecurringCall } from '../backup/hooks/recurringCall.hook';
import { Link, useStyles } from '@grafana/ui';
import { getStyles } from './Tickets.styles';
import { Messages } from './Tickets.messages';

const columns: Array<Column<Ticket>> = [
  {
    Header: Messages.table.columns.number,
    accessor: 'number',
    // eslint-disable-next-line react/display-name
    Cell: ({ value, row }) => <Link href={row.values.url}>{value}</Link>,
  },
  {
    Header: Messages.table.columns.description,
    accessor: 'shortDescription',
  },
  {
    Header: Messages.table.columns.priority,
    accessor: 'priority',
  },
  {
    Header: Messages.table.columns.state,
    accessor: 'state',
  },
  {
    Header: Messages.table.columns.createDate,
    accessor: 'createTime',
  },
  {
    Header: Messages.table.columns.department,
    accessor: 'department',
  },
  {
    Header: Messages.table.columns.type,
    accessor: 'taskType',
  },
];

export const TicketsPage: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<Ticket[]>([]);
  const [generateToken] = useCancelToken();
  const [triggerTimeout] = useRecurringCall();
  const styles = useStyles(getStyles);

  const getData = useCallback(async (showLoading = false) => {
    showLoading && setPending(true);

    try {
      const backups = await TicketsService.list(generateToken(LIST_TICKETS_CANCEL_TOKEN));
      setData(backups);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData(true).then(() => triggerTimeout(getData, DATA_INTERVAL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <div className={styles.pageWrapper}>
        <Table
          data={data}
          columns={columns}
          totalItems={data.length}
          pendingRequest={pending}
          emptyMessage={Messages.table.noData}
        ></Table>
      </div>
    </PageWrapper>
  );
};

export default TicketsPage;

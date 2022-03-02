import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, Row } from 'react-table';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { DATA_INTERVAL, LIST_TICKETS_CANCEL_TOKEN, PAGE_MODEL } from './Tickets.constants';
import { logger, Table } from '@percona/platform-core';
import { isApiCancelError } from '../shared/helpers/api';
import { useCancelToken } from '../shared/components/hooks/cancelToken.hook';
import { PlatformConnectedLoader } from '../shared/components/Elements/PlatformConnectedLoader';
import { TicketsService } from './Tickets.service';
import { Ticket } from './Tickets.types';
import { useRecurringCall } from '../backup/hooks/recurringCall.hook';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Tickets.styles';
import { Messages } from './Tickets.messages';
import { css } from '@emotion/css';
import { palette } from '@grafana/data/src/themes/palette';

export const TicketsPage: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<Ticket[]>([]);
  const [generateToken] = useCancelToken();
  const [triggerTimeout] = useRecurringCall();
  const styles = useStyles(getStyles);

  const columns = useMemo(
    (): Column[] => [
      {
        Header: Messages.table.columns.number,
        accessor: 'number',
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
    ],
    []
  );

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

  const redirect = (url: string) => {
    window.open(url, '_blank');
  };

  const getRowProps = (row: Row<Ticket>) => ({
    key: 'row',
    onClick: () => redirect(row.original.url),
    className: css`
      cursor: pointer;
      &:hover {
        background-color: ${palette.gray15};
      }
    `,
  });

  const getCellProps = () => ({
    key: 'cell',
    className: css`
      background-color: transparent !important;
    `,
  });

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <PlatformConnectedLoader>
        <div className={styles.pageWrapper}>
          <Table
            data={data}
            columns={columns}
            totalItems={data.length}
            pendingRequest={pending}
            emptyMessage={Messages.table.noData}
            getRowProps={getRowProps}
            getCellProps={getCellProps}
          ></Table>
        </div>
      </PlatformConnectedLoader>
    </PageWrapper>
  );
};

export default TicketsPage;

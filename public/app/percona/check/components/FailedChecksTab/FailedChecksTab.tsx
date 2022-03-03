import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { LoaderButton, logger } from '@percona/platform-core';
import { Column } from 'react-table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { FailedCheckSummary } from 'app/percona/check/types';
import { useStoredTablePageSize } from 'app/percona/integrated-alerting/components/Table/Pagination';
import { AlertsReloadContext } from 'app/percona/check/Check.context';
import { CheckService } from 'app/percona/check/Check.service';
import { Spinner, Switch, useStyles } from '@grafana/ui';
import { Messages } from './FailedChecksTab.messages';
import { getStyles } from './FailedChecksTab.styles';
import { loadShowSilencedValue, saveShowSilencedValue } from './FailedChecksTab.utils';
import { appEvents } from '../../../../core/app_events';
import { AppEvents } from '@grafana/data';
import { FAILED_CHECKS_TABLE_ID, GET_ACTIVE_ALERTS_CANCEL_TOKEN } from './FailedChecksTab.constants';

export const FailedChecksTab: FC = () => {
  const [fetchAlertsPending, setFetchAlertsPending] = useState(true);
  const [runChecksPending, setRunChecksPending] = useState(false);
  const [showSilenced, setShowSilenced] = useState(loadShowSilencedValue());
  const [data, setData] = useState<FailedCheckSummary[]>([]);
  const [pageSize, setPageSize] = useStoredTablePageSize(FAILED_CHECKS_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const styles = useStyles(getStyles);
  const [generateToken] = useCancelToken();

  const columns = useMemo(
    (): Array<Column<FailedCheckSummary>> => [
      {
        Header: 'Service Name',
        accessor: 'serviceName',
      },
      {
        Header: 'Error',
        accessor: 'errorCount',
      },
      {
        Header: 'Warning',
        accessor: 'warningCount',
      },
      {
        Header: 'Notice',
        accessor: 'noticeCount',
      },
    ],
    []
  );

  const fetchAlerts = useCallback(async (): Promise<void> => {
    setFetchAlertsPending(true);

    try {
      const {
        data,
        totals: { totalItems, totalPages },
      } = await CheckService.getAllFailedChecks(pageSize, pageIndex, generateToken(GET_ACTIVE_ALERTS_CANCEL_TOKEN));
      setData(data);
      setTotalItems(totalItems);
      setTotalPages(totalPages);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setFetchAlertsPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSilenced]);

  const handleRunChecksClick = async () => {
    setRunChecksPending(true);
    try {
      await CheckService.runDbChecks();
      appEvents.emit(AppEvents.alertSuccess, [Messages.checksExecutionStarted]);
    } catch (e) {
      logger.error(e);
    } finally {
      setRunChecksPending(false);
    }
  };

  const toggleShowSilenced = () => {
    setShowSilenced((currentValue) => !currentValue);
  };

  const onPaginationChanged = useCallback(
    (pageSize: number, pageIndex: number) => {
      setPageSize(pageSize);
      setPageindex(pageIndex);
    },
    [setPageindex, setPageSize]
  );

  useEffect(() => {
    fetchAlerts();
    saveShowSilencedValue(showSilenced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSilenced]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.actionButtons} data-testid="db-check-panel-actions">
          <span className={styles.showAll}>
            <span data-testid="db-checks-failed-checks-toggle-silenced">
              <Switch value={showSilenced} onChange={toggleShowSilenced} />
            </span>
            <span>{Messages.showAll}</span>
          </span>
          <LoaderButton
            type="button"
            size="md"
            loading={runChecksPending}
            onClick={handleRunChecksClick}
            className={styles.runChecksButton}
          >
            {Messages.runDbChecks}
          </LoaderButton>
        </div>
      </div>
      <AlertsReloadContext.Provider value={{ fetchAlerts }}>
        {fetchAlertsPending ? (
          <div className={styles.spinner} data-testid="db-checks-failed-checks-spinner">
            <Spinner />
          </div>
        ) : (
          <Table
            showPagination
            data={data}
            columns={columns}
            totalItems={totalItems}
            totalPages={totalPages}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onPaginationChanged={onPaginationChanged}
            pendingRequest={fetchAlertsPending}
            emptyMessage={Messages.noChecks}
          />
        )}
      </AlertsReloadContext.Provider>
    </>
  );
};

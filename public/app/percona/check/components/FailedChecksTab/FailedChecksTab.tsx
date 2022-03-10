import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { LoaderButton, logger } from '@percona/platform-core';
import { Cell, Column, Row, TableCellProps, TableRowProps } from 'react-table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { FailedCheckSummary } from 'app/percona/check/types';
import { AlertsReloadContext } from 'app/percona/check/Check.context';
import { CheckService } from 'app/percona/check/Check.service';
import { Spinner, Switch, useStyles2 } from '@grafana/ui';
import { Messages } from './FailedChecksTab.messages';
import { getStyles } from './FailedChecksTab.styles';
import { loadShowSilencedValue, saveShowSilencedValue } from './FailedChecksTab.utils';
import { appEvents } from '../../../../core/app_events';
import { AppEvents } from '@grafana/data';
import { GET_ACTIVE_ALERTS_CANCEL_TOKEN } from './FailedChecksTab.constants';
import { locationService } from '@grafana/runtime';

export const FailedChecksTab: FC = () => {
  const [fetchAlertsPending, setFetchAlertsPending] = useState(true);
  const [runChecksPending, setRunChecksPending] = useState(false);
  const [showSilenced, setShowSilenced] = useState(loadShowSilencedValue());
  const [data, setData] = useState<FailedCheckSummary[]>([]);
  const styles = useStyles2(getStyles);
  const [generateToken] = useCancelToken();

  const columns = useMemo(
    (): Array<Column<FailedCheckSummary>> => [
      {
        Header: 'Service Name',
        accessor: 'serviceName',
      },
      {
        Header: 'Critical',
        accessor: 'criticalCount',
      },
      {
        Header: 'Major',
        accessor: 'majorCount',
      },
      {
        Header: 'Trivial',
        accessor: 'trivialCount',
      },
    ],
    []
  );

  const fetchAlerts = useCallback(async (): Promise<void> => {
    setFetchAlertsPending(true);

    try {
      const checks = await CheckService.getAllFailedChecks(generateToken(GET_ACTIVE_ALERTS_CANCEL_TOKEN));
      setData(checks);
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

  const getRowProps = (row: Row<FailedCheckSummary>): TableRowProps => ({
    key: row.original.serviceId,
    className: styles.row,
    // @ts-ignore
    onClick: () => locationService.push(`/pmm-database-checks/service-checks/${row.original.serviceName}`),
  });

  const getCellProps = (cellInfo: Cell<FailedCheckSummary>): TableCellProps => ({
    key: `${cellInfo.row.original.serviceId}-${cellInfo.row.id}`,
    className: styles.cell,
  });

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
            totalItems={data.length}
            data={data}
            getRowProps={getRowProps}
            getCellProps={getCellProps}
            columns={columns}
            pendingRequest={fetchAlertsPending}
            emptyMessage={Messages.noChecks}
          />
        )}
      </AlertsReloadContext.Provider>
    </>
  );
};

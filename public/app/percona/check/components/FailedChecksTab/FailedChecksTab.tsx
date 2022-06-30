import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { logger } from '@percona/platform-core';
import { Cell, Column, Row } from 'react-table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import Page from 'app/core/components/Page/Page';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { ExtendedTableCellProps, ExtendedTableRowProps, Table } from 'app/percona/integrated-alerting/components/Table';
import { FailedCheckSummary } from 'app/percona/check/types';
import { AlertsReloadContext } from 'app/percona/check/Check.context';
import { CheckService } from 'app/percona/check/Check.service';
import { useStyles2 } from '@grafana/ui';
import { Messages } from './FailedChecksTab.messages';
import { Messages as mainChecksMessages } from '../../CheckPanel.messages';
import { getStyles } from './FailedChecksTab.styles';
import { stripServiceId } from './FailedChecksTab.utils';

import { GET_ACTIVE_ALERTS_CANCEL_TOKEN } from './FailedChecksTab.constants';
import { locationService } from '@grafana/runtime';
import { Failures } from './Failures/Failures';

export const FailedChecksTab: FC = () => {
  const [fetchAlertsPending, setFetchAlertsPending] = useState(true);
  const navModel = usePerconaNavModel('failed-checks');
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
        Header: 'Fail Count by Severity',
        accessor: 'counts',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) => <Failures counts={value} />,
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
  }, []);

  const getRowProps = (row: Row<FailedCheckSummary>): ExtendedTableRowProps => ({
    key: row.original.serviceId,
    className: styles.row,
    onClick: () => locationService.push(`/pmm-database-checks/failed-checks/${stripServiceId(row.original.serviceId)}`),
  });

  const getCellProps = (cellInfo: Cell<FailedCheckSummary>): ExtendedTableCellProps => ({
    key: `${cellInfo.row.original.serviceId}-${cellInfo.row.id}`,
    className: styles.cell,
  });

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('sttEnabled'), []);

  return (
    <Page navModel={navModel} tabsDataTestId="db-check-tabs-bar" data-testid="db-check-panel">
      <Page.Contents dataTestId="db-check-tab-content">
        <FeatureLoader
          messagedataTestId="db-check-panel-settings-link"
          featureName={mainChecksMessages.advisors}
          featureSelector={featureSelector}
        >
          <AlertsReloadContext.Provider value={{ fetchAlerts }}>
            <Table
              totalItems={data.length}
              data={data}
              getRowProps={getRowProps}
              getCellProps={getCellProps}
              columns={columns}
              pendingRequest={fetchAlertsPending}
              emptyMessage={Messages.noChecks}
            />
          </AlertsReloadContext.Provider>
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default FailedChecksTab;

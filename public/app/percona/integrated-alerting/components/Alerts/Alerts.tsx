/* eslint-disable react/display-name */
import { cx } from '@emotion/css';
import { logger, Chip } from '@percona/platform-core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Cell, Column, Row } from 'react-table';

import { AppEvents } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';
import appEvents from 'app/core/app_events';
import { OldPage } from 'app/core/components/Page/Page';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { SilenceBell } from 'app/percona/shared/components/Elements/SilenceBell';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';

import { Messages } from '../../IntegratedAlerting.messages';
import { Severity } from '../Severity';
import { useStoredTablePageSize } from '../Table/Pagination';
import { Table } from '../Table/Table';

import { AlertDetails } from './AlertDetails/AlertDetails';
import { ALERT_RULE_TEMPLATES_TABLE_ID, GET_ALERTS_CANCEL_TOKEN, TOGGLE_ALERT_CANCEL_TOKEN } from './Alerts.constants';
import { AlertsService } from './Alerts.service';
import { getStyles } from './Alerts.styles';
import { Alert, AlertStatus, AlertTogglePayload } from './Alerts.types';
import { formatAlerts } from './Alerts.utils';

const {
  table: { noData, columns },
  activateSuccess,
  silenceSuccess,
  activateTitle,
  silenceTitle,
} = Messages.alerts;
const {
  activeSince: activeSinceColumn,
  labels: labelsColumn,
  lastNotified: lastNotifiedColumn,
  severity: severityColumn,
  state: stateColumn,
  summary: summaryColumn,
  actions: actionsColumn,
} = columns;

export const Alerts: FC = () => {
  const style = useStyles2(getStyles);
  const [pendingRequest, setPendingRequest] = useState(true);
  const navModel = usePerconaNavModel('integrated-alerting-alerts');
  const [data, setData] = useState<Alert[]>([]);
  const [pageSize, setPageSize] = useStoredTablePageSize(ALERT_RULE_TEMPLATES_TABLE_ID);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [generateToken] = useCancelToken();

  const getAlerts = useCallback(async () => {
    setPendingRequest(true);
    try {
      const { alerts, totals } = await AlertsService.list(pageSize, pageIndex, generateToken(GET_ALERTS_CANCEL_TOKEN));
      setData(formatAlerts(alerts));
      setTotalItems(totals.total_items || 0);
      setTotalPages(totals.total_pages || 0);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPendingRequest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  const toggleAlert = useCallback(
    async (alertId: string, silenced: boolean) => {
      try {
        await AlertsService.toggle(
          {
            alert_ids: [alertId],
            silenced: silenced ? 'FALSE' : 'TRUE',
          },
          generateToken(TOGGLE_ALERT_CANCEL_TOKEN)
        );
        appEvents.emit(AppEvents.alertSuccess, [silenced ? activateSuccess : silenceSuccess]);
        getAlerts();
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAlerts]
  );

  const columns = React.useMemo(
    (): Array<Column<Alert>> => [
      {
        Header: summaryColumn,
        accessor: 'summary',
        width: '30%',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: severityColumn,
        accessor: 'severity',
        Cell: ({ row, value }) => (
          <Severity
            severity={value}
            className={cx({ [style.silencedSeverity]: row.original.status === AlertStatus.SILENCED })}
          />
        ),
        width: '5%',
      },
      {
        Header: stateColumn,
        accessor: 'status',
        width: '5%',
      },
      {
        Header: labelsColumn,
        accessor: ({ labels }: Alert) => (
          <div className={style.labelsWrapper}>
            {labels.primary.map((label) => (
              <Chip text={label} key={label} />
            ))}
          </div>
        ),
        width: '40%',
      },
      {
        Header: activeSinceColumn,
        accessor: 'activeSince',
        width: '10%',
      },
      {
        Header: lastNotifiedColumn,
        accessor: 'lastNotified',
        width: '10%',
      },
      {
        Header: actionsColumn,
        accessor: 'alertId',
        Cell: ({ value, row }) => (
          <span className={style.actionsWrapper}>
            <SilenceBell
              onClick={() => toggleAlert(value, row.original.status === AlertStatus.SILENCED)}
              silenced={row.original.status === AlertStatus.SILENCED}
              tooltip={row.original.status === AlertStatus.SILENCED ? activateTitle : silenceTitle}
            />
          </span>
        ),
      },
    ],
    [style.actionsWrapper, style.labelsWrapper, style.silencedSeverity, toggleAlert]
  );

  const getCellProps = useCallback(
    (cell: Cell<Alert>) => ({
      className: cell.row.original.status === AlertStatus.SILENCED ? style.disabledRow : '',
      key: cell.row.original.alertId,
    }),
    [style.disabledRow]
  );

  const handlePaginationChanged = useCallback(
    (pageSize: number, pageIndex: number) => {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
    },
    [setPageSize, setPageIndex]
  );

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Alert>) => (
      <AlertDetails ruleExpression={row.original.rule?.expr} labels={row.original.labels.secondary} />
    ),
    []
  );

  const handleSilenceAll = useCallback(async (silenced: AlertTogglePayload['silenced']) => {
    await AlertsService.toggle({ silenced, alert_ids: [] });
    getAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('alertingEnabled'), []);

  useEffect(() => {
    getAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <TechnicalPreview />
        <FeatureLoader featureName={Messages.integratedAlerting} featureSelector={featureSelector}>
          <div className={style.actionsWrapper}>
            <Button
              size="md"
              icon="bell-slash"
              fill="text"
              onClick={() => handleSilenceAll('TRUE')}
              data-testid="alert-rule-template-add-modal-button"
            >
              {Messages.alerts.silenceAllAction}
            </Button>
            <Button
              size="md"
              icon="bell"
              fill="text"
              onClick={() => handleSilenceAll('FALSE')}
              data-testid="alert-rule-template-add-modal-button"
            >
              {Messages.alerts.unsilenceAllAction}
            </Button>
          </div>
          <Table
            showPagination
            totalItems={totalItems}
            totalPages={totalPages}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onPaginationChanged={handlePaginationChanged}
            data={data}
            columns={columns}
            pendingRequest={pendingRequest}
            emptyMessage={noData}
            getCellProps={getCellProps}
            renderExpandedRow={renderSelectedSubRow}
          />
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default Alerts;

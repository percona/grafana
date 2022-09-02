/* eslint-disable react/display-name */
import { logger } from '@percona/platform-core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Cell, Column, Row } from 'react-table';

import { Button, useStyles } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { Severity } from 'app/percona/shared/core';
import { getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';

import { Messages } from '../../IntegratedAlerting.messages';
import { Severity as SeverityComp } from '../Severity';
import { useStoredTablePageSize } from '../Table/Pagination';
import { Table } from '../Table/Table';

import { AddAlertRuleModal } from './AddAlertRuleModal';
import { ALERT_RULES_TABLE_ID, GET_ALERT_RULES_CANCEL_TOKEN } from './AlertRules.constants';
import { AlertRulesProvider } from './AlertRules.provider';
import { AlertRulesService } from './AlertRules.service';
import { getStyles } from './AlertRules.styles';
import { AlertRule } from './AlertRules.types';
import { formatRules } from './AlertRules.utils';
import { AlertRulesActions } from './AlertRulesActions';
import { AlertRulesParamsDetails } from './AlertRulesParamsDetails';

const { noData, columns } = Messages.alertRules.table;

const {
  createdAt: createdAtColumn,
  duration: durationColumn,
  filters: filtersColumn,
  severity: severityColumn,
  summary: summaryColumn,
  params: paramsColumn,
  actions: actionsColumn,
} = columns;

export const AlertRules: FC = () => {
  const styles = useStyles(getStyles);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(true);
  const navModel = usePerconaNavModel('integrated-alerting-rules');
  const [selectedAlertRule, setSelectedAlertRule] = useState<AlertRule | null>();
  const [data, setData] = useState<AlertRule[]>([]);
  const [pageSize, setPageSize] = useStoredTablePageSize(ALERT_RULES_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [generateToken] = useCancelToken();

  const getAlertRules = useCallback(async () => {
    setPendingRequest(true);
    try {
      const { rules = [], totals } = await AlertRulesService.list(
        {
          page_params: {
            index: pageIndex,
            page_size: pageSize,
          },
        },
        generateToken(GET_ALERT_RULES_CANCEL_TOKEN)
      );
      setData(formatRules(rules));
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
  }, [pageIndex, pageSize]);

  const columns = React.useMemo(
    (): Array<Column<AlertRule>> => [
      {
        Header: summaryColumn,
        accessor: 'name',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
        width: '25%',
      },
      {
        Header: paramsColumn,
        accessor: 'params',
        Cell: ({ row }) => {
          const { values } = row;
          return <AlertRulesParamsDetails params={values.params} />;
        },
        width: '15%',
      },
      {
        Header: durationColumn,
        accessor: 'duration',
        width: '10%',
      },
      {
        Header: severityColumn,
        accessor: 'severity',
        Cell: ({ value }: { value: Severity }) => <SeverityComp severity={value} />,
        width: '5%',
      },
      {
        Header: filtersColumn,
        accessor: ({ filters }: AlertRule) => (
          <div className={styles.filtersWrapper}>
            {filters.map((filter) => (
              <span key={filter} className={styles.filter}>
                {filter}
              </span>
            ))}
          </div>
        ),
        width: '30%',
      },
      {
        Header: createdAtColumn,
        accessor: 'createdAt',
        width: '10%',
      },
      {
        Header: actionsColumn,
        width: '5%',
        accessor: (alertRule: AlertRule) => <AlertRulesActions alertRule={alertRule} />,
      },
    ],
    [styles.filter, styles.filtersWrapper]
  );

  const onPaginationChanged = useCallback(
    (pageSize: number, pageIndex: number) => {
      setPageSize(pageSize);
      setPageindex(pageIndex);
    },
    [setPageindex, setPageSize]
  );

  const handleAddButton = () => {
    setSelectedAlertRule(null);
    setAddModalVisible((currentValue) => !currentValue);
  };

  const renderSelectedSubRow = useCallback(
    ({ original }: Row<AlertRule>) => (
      <pre data-testid="alert-rules-details" className={styles.details}>
        {original.expr}
      </pre>
    ),
    [styles.details]
  );

  const getCellProps = useCallback(
    (cell: Cell<AlertRule>) => ({
      className: cell.row.original.disabled ? styles.disabledRow : '',
      key: cell.row.original.ruleId,
    }),
    [styles.disabledRow]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('alertingEnabled'), []);

  useEffect(() => {
    getAlertRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <TechnicalPreview />
        <FeatureLoader featureName={Messages.integratedAlerting} featureSelector={featureSelector}>
          <AlertRulesProvider.Provider value={{ getAlertRules, setAddModalVisible, setSelectedAlertRule }}>
            <div className={styles.actionsWrapper}>
              <Button
                size="md"
                icon="plus-square"
                fill="text"
                onClick={handleAddButton}
                data-testid="alert-rule-template-add-modal-button"
              >
                {Messages.alertRuleTemplate.addAction}
              </Button>
            </div>
            <AddAlertRuleModal
              isVisible={addModalVisible}
              setVisible={setAddModalVisible}
              alertRule={selectedAlertRule}
            />
            <Table
              showPagination
              totalItems={totalItems}
              totalPages={totalPages}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPaginationChanged={onPaginationChanged}
              renderExpandedRow={renderSelectedSubRow}
              data={data}
              columns={columns}
              pendingRequest={pendingRequest}
              emptyMessage={noData}
              getCellProps={getCellProps}
            />
          </AlertRulesProvider.Provider>
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default AlertRules;

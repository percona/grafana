import React, { FC, useCallback, useEffect, useState } from 'react';
import { Cell, Column, Row } from 'react-table';
import { Button, useStyles, IconButton } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from '../Table/Table';
import { AddAlertRuleModal } from './AddAlertRuleModal';
import { Severity } from '../Severity';
import { getStyles } from './AlertRules.styles';
import { AlertRulesProvider } from './AlertRules.provider';
import { AlertRulesService } from './AlertRules.service';
import { Messages } from '../../IntegratedAlerting.messages';
import { formatRules } from './AlertRules.utils';
import { AlertRule } from './AlertRules.types';
import { AlertRulesActions } from './AlertRulesActions';
import { ALERT_RULES_TABLE_ID, GET_ALERT_RULES_CANCEL_TOKEN } from './AlertRules.constants';
import { useStoredTablePageSize } from '../Table/Pagination';
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
  const [selectedAlertRule, setSelectedAlertRule] = useState<AlertRule | null>();
  const [data, setData] = useState<AlertRule[]>([]);
  const [pageSize, setPageSize] = useStoredTablePageSize(ALERT_RULES_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [generateToken] = useCancelToken();

  const getAlertRules = async () => {
    setPendingRequest(true);
    try {
      const { rules = [], totals } = await AlertRulesService.list(
        {
          page_params: {
            index: pageIndex,
            page_size: pageSize as number,
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
  };

  const columns = React.useMemo(
    () => [
      {
        Header: summaryColumn,
        accessor: 'summary',
        // TODO replace with ExpandableCell after the PR below is merged
        // https://github.com/percona-platform/grafana/pull/83
        Cell: ({ row, value }) => {
          const restProps = row.getToggleRowExpandedProps ? row.getToggleRowExpandedProps() : {};
          return (
            <div className={styles.nameWrapper} {...restProps}>
              <span>{value}</span>
              {row.isExpanded ? (
                <IconButton data-testid="hide-alert-rule-details" name="arrow-up" />
              ) : (
                <IconButton data-testid="show-alert-rule-details" name="arrow-down" />
              )}
            </div>
          );
        },
        width: '25%',
      } as Column,
      {
        Header: paramsColumn,
        accessor: 'params',
        Cell: ({ row }) => {
          const { values } = row;
          return <AlertRulesParamsDetails params={values.params} />;
        },
        width: '15%',
      } as Column,
      {
        Header: durationColumn,
        accessor: 'duration',
        width: '10%',
      } as Column,
      {
        Header: severityColumn,
        accessor: 'severity',
        Cell: ({ value }) => <Severity severity={value} />,
        width: '5%',
      } as Column,
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
      } as Column,
      {
        Header: createdAtColumn,
        accessor: 'createdAt',
        width: '10%',
      } as Column,
      {
        Header: actionsColumn,
        width: '5%',
        accessor: (alertRule: AlertRule) => <AlertRulesActions alertRule={alertRule} />,
      } as Column,
    ],
    []
  );

  const onPaginationChanged = useCallback((pageSize: number, pageIndex: number) => {
    setPageSize(pageSize);
    setPageindex(pageIndex);
  }, []);

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
    []
  );

  const getCellProps = useCallback(
    (cell: Cell<AlertRule>) => ({
      className: cell.row.original.disabled ? styles.disabledRow : '',
      key: cell.row.original.ruleId,
    }),
    []
  );

  useEffect(() => {
    getAlertRules();
  }, [pageSize, pageIndex]);

  return (
    <AlertRulesProvider.Provider value={{ getAlertRules, setAddModalVisible, setSelectedAlertRule }}>
      <div className={styles.actionsWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          onClick={handleAddButton}
          data-testid="alert-rule-template-add-modal-button"
        >
          {Messages.alertRuleTemplate.addAction}
        </Button>
      </div>
      <AddAlertRuleModal isVisible={addModalVisible} setVisible={setAddModalVisible} alertRule={selectedAlertRule} />
      <Table
        showPagination
        totalItems={totalItems}
        totalPages={totalPages}
        pageSize={pageSize as number}
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
  );
};

import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useStyles2 } from '@grafana/ui';
import { Column } from 'react-table';
import {
  LoaderButton,
  logger,
  TextInputField,
  RadioButtonGroupField,
  ChipAreaInputField,
} from '@percona/platform-core';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { CheckDetails, Interval } from 'app/percona/check/types';
import { CheckService } from 'app/percona/check/Check.service';
import { Messages } from './AllChecksTab.messages';
import { GET_ALL_CHECKS_CANCEL_TOKEN, INTERVAL_OPTIONS, STATUS_OPTIONS } from './AllChecksTab.constants';
import { FetchChecks } from './types';
import { CheckActions } from './CheckActions/CheckActions';
import { ChangeCheckIntervalModal } from './ChangeCheckIntervalModal';
import { withFilterTypes } from 'app/percona/shared/components/Elements/FilterSection/withFilterTypes';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';
import { getStyles } from './AllChecksTab.styles';
interface FormValues {
  categories: string[];
}
const Filters = withFilterTypes<FormValues>();
import { appEvents } from '../../../../core/app_events';
import { AppEvents } from '@grafana/data';

export const AllChecksTab: FC = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const [fetchChecksPending, setFetchChecksPending] = useState(false);
  const [runChecksPending, setRunChecksPending] = useState(false);
  const [checkIntervalModalVisible, setCheckIntervalModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<CheckDetails>();
  const [checks, setChecks] = useState<CheckDetails[]>([]);
  const styles = useStyles2(getStyles);
  const [generateToken] = useCancelToken();
  const [categories] = getValuesFromQueryParams<[string[]]>(queryParams, [{ key: 'category' }]);

  const fetchChecks: FetchChecks = useCallback(async () => {
    setFetchChecksPending(true);
    try {
      const checks = await CheckService.getAllChecks(
        [{ category: { stringValues: categories } }],
        generateToken(GET_ALL_CHECKS_CANCEL_TOKEN)
      );

      setChecks(checks);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setFetchChecksPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

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

  const runIndividualCheck = async (check: CheckDetails) => {
    try {
      await CheckService.runIndividualDbCheck(check.name);
      appEvents.emit(AppEvents.alertSuccess, [`${check.summary} ${Messages.runIndividualDbCheck}`]);
    } catch (e) {
      logger.error(e);
    } finally {
    }
  };

  const updateUI = (check: CheckDetails) => {
    const { name, disabled, interval } = check;

    setChecks((oldChecks) =>
      oldChecks.map((oldCheck) => {
        if (oldCheck.name !== name) {
          return oldCheck;
        }

        return { ...oldCheck, disabled, interval };
      })
    );
  };

  const changeCheck = useCallback(async (check: CheckDetails) => {
    const action = !!check.disabled ? 'enable' : 'disable';
    try {
      await CheckService.changeCheck({ params: [{ name: check.name, [action]: true }] });
      updateUI({ ...check, disabled: !check.disabled });
    } catch (e) {
      logger.error(e);
    }
  }, []);

  const handleIntervalChangeClick = useCallback((check: CheckDetails) => {
    setSelectedCheck(check);
    setCheckIntervalModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setCheckIntervalModalVisible(false);
    setSelectedCheck(undefined);
  }, []);

  const handleIntervalChanged = useCallback(
    (check: CheckDetails) => {
      updateUI({ ...check });
      handleModalClose();
    },
    [handleModalClose]
  );

  const applyFilters = ({ categories }: FormValues) => setQueryParams({ category: categories });

  const columns = useMemo(
    (): Array<Column<CheckDetails>> => [
      {
        Header: Messages.table.columns.name,
        accessor: 'summary',
      },
      {
        Header: Messages.table.columns.description,
        accessor: 'description',
      },
      {
        Header: Messages.table.columns.category,
        accessor: 'category',
      },
      {
        Header: Messages.table.columns.status,
        accessor: 'disabled',
        Cell: ({ value }) => (!!value ? Messages.disabled : Messages.enabled),
      },
      {
        Header: Messages.table.columns.interval,
        accessor: 'interval',
        Cell: ({ value }) => Interval[value],
      },
      {
        Header: Messages.table.columns.actions,
        accessor: 'name',
        id: 'actions',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }) => (
          <CheckActions
            check={row.original}
            onChangeCheck={changeCheck}
            onIntervalChangeClick={handleIntervalChangeClick}
            onIndividualRunCheckClick={runIndividualCheck}
          />
        ),
      },
    ],
    [changeCheck, handleIntervalChangeClick]
  );

  useEffect(() => {
    fetchChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Filters onApply={applyFilters}>
        <ChipAreaInputField name="categories" label={Messages.table.columns.category} initialChips={categories || []} />
        <TextInputField name="name" label={Messages.table.columns.name} disabled defaultValue="*" />
        <RadioButtonGroupField
          fullWidth
          options={STATUS_OPTIONS}
          name="status"
          disabled
          label={Messages.table.columns.status}
          defaultValue="all"
        />
        <RadioButtonGroupField
          fullWidth
          options={INTERVAL_OPTIONS}
          name="interval"
          disabled
          label={Messages.table.columns.interval}
          defaultValue="all"
        />
        <TextInputField
          fieldClassName={styles.descriptionFilter}
          name="description"
          label={Messages.table.columns.description}
          disabled
          defaultValue="*"
        />
      </Filters>
      <div className={styles.actionButtons} data-testid="db-check-panel-actions">
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
      <Table
        totalItems={checks.length}
        data={checks}
        columns={columns}
        pendingRequest={fetchChecksPending}
        emptyMessage={Messages.table.noData}
      />
      {!!selectedCheck && checkIntervalModalVisible && (
        <ChangeCheckIntervalModal
          check={selectedCheck}
          onClose={handleModalClose}
          onIntervalChanged={handleIntervalChanged}
        />
      )}
    </>
  );
};

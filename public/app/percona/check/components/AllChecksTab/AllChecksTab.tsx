import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useStyles2 } from '@grafana/ui';
import { AppEvents } from '@grafana/data';
import { Column } from 'react-table';
import { LoaderButton, logger } from '@percona/platform-core';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { CheckDetails, Interval } from 'app/percona/check/types';
import { CheckService } from 'app/percona/check/Check.service';
import { GET_ALL_CHECKS_CANCEL_TOKEN } from './AllChecksTab.constants';
import { Messages } from './AllChecksTab.messages';
import { Messages as mainChecksMessages } from '../../CheckPanel.messages';
import { FetchChecks } from './types';
import { CheckActions } from './CheckActions/CheckActions';
import { ChangeCheckIntervalModal } from './ChangeCheckIntervalModal';
import { getStyles } from './AllChecksTab.styles';
import { appEvents } from '../../../../core/app_events';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import Page from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { ALL_VALUES_VALUE, isTextIncluded, isSameOption } from 'app/percona/shared/helpers/filters';
import { CheckFilters } from './CheckFilters/CheckFilters';
import { getFiltersFromUrlParams } from './AllChecksTab.utils';

export const AllChecksTab: FC = () => {
  const [queryParams] = useQueryParams();
  const [fetchChecksPending, setFetchChecksPending] = useState(false);
  const navModel = usePerconaNavModel('all-checks');
  const [generateToken] = useCancelToken();
  const [runChecksPending, setRunChecksPending] = useState(false);
  const [checkIntervalModalVisible, setCheckIntervalModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<CheckDetails>();
  // Since there are not many checks, we can afford to save both raw and filtered data without the need to re-fetch
  const [allChecks, setAllChecks] = useState<CheckDetails[]>([]);
  const [checks, setChecks] = useState<CheckDetails[]>([]);
  const styles = useStyles2(getStyles);
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

  const filter = useCallback(
    (checks: CheckDetails[]) => {
      const { name, description, status, interval } = getFiltersFromUrlParams(queryParams);
      const filteredChecks = checks.filter(
        ({ summary, description: checkDescription, disabled, interval: checkInterval }) =>
          isTextIncluded(name, summary) &&
          isTextIncluded(description, checkDescription || '') &&
          isSameOption(interval.toLowerCase(), checkInterval.toLowerCase(), ALL_VALUES_VALUE) &&
          isSameOption(status, disabled ? 'disabled' : 'enabled', ALL_VALUES_VALUE)
      );
      setChecks(filteredChecks);
    },
    [queryParams]
  );

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
    const fetchChecks: FetchChecks = async () => {
      setFetchChecksPending(true);
      try {
        const checks = await CheckService.getAllChecks(generateToken(GET_ALL_CHECKS_CANCEL_TOKEN));
        setAllChecks(checks);
        filter(checks);
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
      setFetchChecksPending(false);
    };
    fetchChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => filter(allChecks), [allChecks, filter]);

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
          <CheckFilters />
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
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default AllChecksTab;

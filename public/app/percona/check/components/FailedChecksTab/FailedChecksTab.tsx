import React, { FC, useEffect, useState, useCallback } from 'react';
import { LoaderButton, logger } from '@percona/platform-core';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import Page from 'app/core/components/Page/Page';
import { useNavModel } from 'app/core/hooks/useNavModel';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { StoreState } from 'app/types';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Table } from 'app/percona/check/components';
import { ActiveCheck } from 'app/percona/check/types';
import { COLUMNS } from 'app/percona/check/CheckPanel.constants';
import { AlertsReloadContext } from 'app/percona/check/Check.context';
import { CheckService } from 'app/percona/check/Check.service';
import { Spinner, Switch, useStyles } from '@grafana/ui';
import { Messages } from './FailedChecksTab.messages';
import { getStyles } from './FailedChecksTab.styles';
import { loadShowSilencedValue, saveShowSilencedValue } from './FailedChecksTab.utils';
import { appEvents } from '../../../../core/app_events';
import { AppEvents } from '@grafana/data';
import { GET_ACTIVE_ALERTS_CANCEL_TOKEN } from './FailedChecksTab.constants';

export const FailedChecksTab: FC = () => {
  const [fetchAlertsPending, setFetchAlertsPending] = useState(true);
  const [runChecksPending, setRunChecksPending] = useState(false);
  const navModel = useNavModel('failed-checks');
  const [showSilenced, setShowSilenced] = useState(loadShowSilencedValue());
  const [dataSource, setDataSource] = useState<ActiveCheck[] | undefined>();
  const styles = useStyles(getStyles);
  const [generateToken] = useCancelToken();

  const fetchAlerts = useCallback(async (): Promise<void> => {
    setFetchAlertsPending(true);

    try {
      const dataSource = await CheckService.getActiveAlerts(
        showSilenced,
        generateToken(GET_ACTIVE_ALERTS_CANCEL_TOKEN)
      );
      setDataSource(dataSource);
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

  useEffect(() => {
    fetchAlerts();
    saveShowSilencedValue(showSilenced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSilenced]);

  const featureSelector = useCallback((state: StoreState) => !!state.perconaSettings.sttEnabled, []);

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <TechnicalPreview />
        <FeatureLoader
          messagedataTestId="db-check-panel-settings-link"
          featureName="stt"
          featureSelector={featureSelector}
        >
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
              <Table data={dataSource} columns={COLUMNS} />
            )}
          </AlertsReloadContext.Provider>
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default FailedChecksTab;

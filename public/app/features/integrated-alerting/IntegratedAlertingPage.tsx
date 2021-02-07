import React, { FC, useState, useEffect } from 'react';
import { useStyles, Spinner } from '@grafana/ui';
import { Messages } from './IntegratedAlerting.messages';
import { getStyles } from './IntegratedAlerting.styles';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { logger } from '@percona/platform-core';
import { EmptyBlock } from './components/EmptyBlock';
import { PMM_SETTINGS_URL } from './IntegratedAlerting.constants';
import { IntegratedAlertingTabs } from './components/IntegratedAlertingTabs';

export const IntegratedAlertingContent: FC<{ loadingSettings: boolean; alertingEnabled: boolean }> = ({
  loadingSettings,
  alertingEnabled,
}) => {
  const styles = useStyles(getStyles);
  if (alertingEnabled) {
    return <IntegratedAlertingTabs />;
  }

  return (
    <EmptyBlock dataQa="ia-empty-block">
      {loadingSettings ? (
        <Spinner />
      ) : (
        <>
          {Messages.general.alertingDisabled}&nbsp;
          <a className={styles.link} href={PMM_SETTINGS_URL}>
            {Messages.general.pmmSettings}
          </a>
        </>
      )}
    </EmptyBlock>
  );
};

const IntegratedAlertingPage: FC = () => {
  const styles = useStyles(getStyles);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [alertingEnabled, setAlertingEnabled] = useState(false);

  const getSettings = async () => {
    setLoadingSettings(true);

    try {
      const {
        settings: { alerting_enabled },
      } = await IntegratedAlertingService.getSettings();
      setAlertingEnabled(!!alerting_enabled);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className={styles.integratedAlertingWrapper}>
      <IntegratedAlertingContent loadingSettings={loadingSettings} alertingEnabled={alertingEnabled} />
    </div>
  );
};

export default IntegratedAlertingPage;

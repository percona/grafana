import React, { FC, useState, useEffect } from 'react';
import { useStyles } from '@grafana/ui';
import { getStyles } from './IntegratedAlerting.styles';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { logger } from '@percona/platform-core';
import { IntegratedAlertingContent } from './components/IntegratedAlertingContent';

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

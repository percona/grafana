import React, { FC, useState, useEffect } from 'react';
import { useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { Breadcrumb } from 'app/core/components/Breadcrumb';
import { IntegratedAlertingContent } from './components/IntegratedAlertingContent';
import { getStyles } from './IntegratedAlerting.styles';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { PAGE_MODEL } from './IntegratedAlerting.constants';

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
      <Breadcrumb pageModel={PAGE_MODEL} />
      <IntegratedAlertingContent loadingSettings={loadingSettings} alertingEnabled={alertingEnabled} />
    </div>
  );
};

export default IntegratedAlertingPage;

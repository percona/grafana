import React, { FC, useEffect, useMemo, useState } from 'react';
import { useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { Breadcrumb } from 'app/core/components/Breadcrumb';
import { IntegratedAlertingContent } from './components/IntegratedAlertingContent';
import { getStyles } from './IntegratedAlerting.styles';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { PAGE_MODEL } from './IntegratedAlerting.constants';
import { TabKeys } from './IntegratedAlerting.types';
import { AlertRules, AlertRuleTemplate, Alerts, NotificationChannel } from './components';
import { TechnicalPreview } from '../shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { TabbedContent, ContentTab } from '../shared/components/Elements/TabbedContent';
import { Messages } from './IntegratedAlerting.messages';

const IntegratedAlertingPage: FC = () => {
  const styles = useStyles(getStyles);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [alertingEnabled, setAlertingEnabled] = useState(false);

  const tabs: ContentTab[] = useMemo(
    (): ContentTab[] => [
      {
        label: Messages.tabs.alerts,
        key: TabKeys.alerts,
        component: () => <Alerts key={TabKeys.alerts} />,
      },
      {
        label: Messages.tabs.alertRules,
        key: TabKeys.alertRules,
        component: () => <AlertRules key={TabKeys.alertRules} />,
      },
      {
        label: Messages.tabs.alertRuleTemplates,
        key: TabKeys.alertRuleTemplates,
        component: () => <AlertRuleTemplate key={TabKeys.alertRuleTemplates} />,
      },
      {
        label: Messages.tabs.notificationChannels,
        key: TabKeys.notificationChannels,
        component: () => <NotificationChannel key={TabKeys.notificationChannels} />,
      },
    ],
    []
  );

  const { path: basePath } = PAGE_MODEL;

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
      <TechnicalPreview />
      <TabbedContent
        tabs={tabs}
        basePath={basePath}
        renderTab={({ Content }) => (
          <IntegratedAlertingContent loadingSettings={loadingSettings} alertingEnabled={alertingEnabled}>
            <Content />
          </IntegratedAlertingContent>
        )}
      />
    </div>
  );
};

export default IntegratedAlertingPage;

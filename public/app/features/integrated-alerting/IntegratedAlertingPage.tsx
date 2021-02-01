import React, { FC, useMemo, useState, useEffect } from 'react';
import { TabsBar, TabContent, Tab, useStyles, Spinner } from '@grafana/ui';
import { Messages } from './IntegratedAlerting.messages';
import { getStyles } from './IntegratedAlerting.styles';
import { TabKeys } from './IntegratedAlerting.types';
import { Alerts, AlertRuleTemplate, AlertRules, NotificationChannel } from './components';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { logger } from '@percona/platform-core';

const IntegratedAlertingTabs: FC = () => {
  const [activeTab, setActiveTab] = useState(TabKeys.alerts);
  const tabs = useMemo(
    () => [
      {
        label: Messages.tabs.alerts,
        key: TabKeys.alerts,
        component: <Alerts key={TabKeys.alerts} />,
      },
      {
        label: Messages.tabs.alertRules,
        key: TabKeys.alertRules,
        component: <AlertRules key={TabKeys.alertRules} />,
      },
      {
        label: Messages.tabs.alertRuleTemplates,
        key: TabKeys.alertRuleTemplates,
        component: <AlertRuleTemplate key={TabKeys.alertRuleTemplates} />,
      },
      {
        label: Messages.tabs.notificationChannels,
        key: TabKeys.notificationChannels,
        component: <NotificationChannel key={TabKeys.notificationChannels} />,
      },
    ],
    []
  );

  return (
    <>
      <TabsBar>
        {tabs.map(tab => (
          <Tab
            key={tab.key}
            label={tab.label}
            active={tab.key === activeTab}
            onChangeTab={() => setActiveTab(tab.key)}
          />
        ))}
      </TabsBar>
      <TabContent>{tabs.find(tab => tab.key === activeTab).component}</TabContent>
    </>
  );
};

const IntegratedAlertingContent: FC<{ loadingSettings: boolean; alertingEnabled: boolean }> = ({
  loadingSettings,
  alertingEnabled,
}) => {
  if (loadingSettings) {
    return <Spinner />;
  }

  return alertingEnabled ? <IntegratedAlertingTabs /> : <span></span>;
};

const IntegratedAlertingPage: FC = () => {
  const styles = useStyles(getStyles);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [alertingEnabled, setalertingEnabled] = useState(false);

  const getSettings = async () => {
    setLoadingSettings(true);
    const {
      settings: { alerting_enabled },
    } = await IntegratedAlertingService.getSettings();
    console.log(alerting_enabled);
    setalertingEnabled(!!alerting_enabled);
    try {
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

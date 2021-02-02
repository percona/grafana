import React, { FC, useMemo, useState, useEffect } from 'react';
import { TabsBar, TabContent, Tab, useStyles, Spinner } from '@grafana/ui';
import { Messages } from './IntegratedAlerting.messages';
import { getStyles } from './IntegratedAlerting.styles';
import { TabKeys } from './IntegratedAlerting.types';
import { Alerts, AlertRuleTemplate, AlertRules, NotificationChannel } from './components';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { logger } from '@percona/platform-core';
import { EmptyBlock } from './components/EmptyBlock/EmptyBlock';
import { PMM_SETTINGS_URL } from './IntegratedAlerting.constants';

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
  const [alertingEnabled, setalertingEnabled] = useState(false);

  const getSettings = async () => {
    setLoadingSettings(true);

    try {
      const {
        settings: { alerting_enabled },
      } = await IntegratedAlertingService.getSettings();
      setalertingEnabled(!!alerting_enabled);
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

import { Tab, TabContent, TabsBar } from '@grafana/ui';
import React, { FC, useMemo, useState } from 'react';
import { Messages } from '../../IntegratedAlerting.messages';
import { TabKeys } from '../../IntegratedAlerting.types';
import { AlertRules } from '../AlertRules';
import { AlertRuleTemplate } from '../AlertRuleTemplate';
import { Alerts } from '../Alerts';
import { NotificationChannel } from '../NotificationChannel';

export const IntegratedAlertingTabs: FC = () => {
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

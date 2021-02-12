import React, { FC, useEffect, useMemo, useState } from 'react';
import { UrlQueryValue } from '@grafana/data';
import { Tab, TabContent, TabsBar } from '@grafana/ui';
import { getLocationSrv } from '@grafana/runtime';
import { useSelector } from 'react-redux';
import { StoreState } from 'app/types';
import { TabKeys } from '../../../IntegratedAlerting.types';
import { DEFAULT_TAB, PAGE_MODEL, PAGE_TABS } from '../../../IntegratedAlerting.constants';
import { AlertRules } from '../../AlertRules';
import { AlertRuleTemplate } from '../../AlertRuleTemplate';
import { Alerts } from '../../Alerts';
import { NotificationChannel } from '../../NotificationChannel';

export const IntegratedAlertingTabs: FC = () => {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const tabKey = useSelector((state: StoreState) => state.location.routeParams.tab);
  const tabComponentMap = useMemo(
    () => [
      {
        id: TabKeys.alerts,
        component: <Alerts key={TabKeys.alerts} />,
      },
      {
        id: TabKeys.alertRules,
        component: <AlertRules key={TabKeys.alertRules} />,
      },
      {
        id: TabKeys.alertRuleTemplates,
        component: <AlertRuleTemplate key={TabKeys.alertRuleTemplates} />,
      },
      {
        id: TabKeys.notificationChannels,
        component: <NotificationChannel key={TabKeys.notificationChannels} />,
      },
    ],
    []
  );

  const { path: basePath } = PAGE_MODEL;

  const isValidTab = (tab: UrlQueryValue) => Object.values(TabKeys).includes(tab as TabKeys);

  const selectTab = (tabKey: string) => {
    getLocationSrv().update({
      path: `${basePath}/${tabKey}`,
    });
  };

  useEffect(() => {
    isValidTab(tabKey) || selectTab(DEFAULT_TAB);
  }, []);

  useEffect(() => {
    setActiveTab(isValidTab(tabKey) ? (tabKey as TabKeys) : DEFAULT_TAB);
  }, [tabKey]);

  return (
    <>
      <TabsBar>
        {PAGE_TABS.map(tab => (
          <Tab key={tab.id} label={tab.title} active={tab.id === activeTab} onChangeTab={() => selectTab(tab.id)} />
        ))}
      </TabsBar>
      <TabContent>{tabComponentMap.find(tab => tab.id === activeTab).component}</TabContent>
    </>
  );
};

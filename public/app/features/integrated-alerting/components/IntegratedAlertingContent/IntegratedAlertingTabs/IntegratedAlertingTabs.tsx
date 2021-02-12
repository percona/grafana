import React, { FC, useEffect, useMemo, useState } from 'react';
import { UrlQueryValue } from '@grafana/data';
import { Tab, TabContent, TabsBar } from '@grafana/ui';
import { getLocationSrv } from '@grafana/runtime';
import { useSelector } from 'react-redux';
import { StoreState } from 'app/types';
import { Breadcrumb, PageModel } from 'app/core/components/Breadcrumb';
import { Messages } from '../../../IntegratedAlerting.messages';
import { TabKeys } from '../../../IntegratedAlerting.types';
import { DEFAULT_TAB } from '../../../IntegratedAlerting.constants';
import { AlertRules } from '../../AlertRules';
import { AlertRuleTemplate } from '../../AlertRuleTemplate';
import { Alerts } from '../../Alerts';
import { NotificationChannel } from '../../NotificationChannel';

export const IntegratedAlertingTabs: FC = () => {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const tabKey = useSelector((state: StoreState) => state.location.routeParams.tab);
  const tabs = useMemo(
    () => [
      {
        title: Messages.tabs.alerts,
        id: TabKeys.alerts,
        path: `integrated-alerting/${TabKeys.alerts}`,
        component: <Alerts key={TabKeys.alerts} />,
      },
      {
        title: Messages.tabs.alertRules,
        id: TabKeys.alertRules,
        path: `integrated-alerting/${TabKeys.alertRules}`,
        component: <AlertRules key={TabKeys.alertRules} />,
      },
      {
        title: Messages.tabs.alertRuleTemplates,
        id: TabKeys.alertRuleTemplates,
        path: `integrated-alerting/${TabKeys.alertRuleTemplates}`,
        component: <AlertRuleTemplate key={TabKeys.alertRuleTemplates} />,
      },
      {
        title: Messages.tabs.notificationChannels,
        key: TabKeys.notificationChannels,
        path: `integrated-alerting/${TabKeys.notificationChannels}`,
        component: <NotificationChannel key={TabKeys.notificationChannels} />,
      },
    ],
    []
  );

  const pageModel: PageModel = {
    title: 'Integrated Alerting',
    path: 'integrated-alerting',
    id: 'integrated-alerting',
    children: tabs.map(({ title, id, path }) => ({ title, id, path })),
  };

  const { path: basePath } = pageModel;

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
      <Breadcrumb pageModel={pageModel} />
      <TabsBar>
        {tabs.map(tab => (
          <Tab key={tab.id} label={tab.title} active={tab.id === activeTab} onChangeTab={() => selectTab(tab.id)} />
        ))}
      </TabsBar>
      <TabContent>{tabs.find(tab => tab.id === activeTab).component}</TabContent>
    </>
  );
};

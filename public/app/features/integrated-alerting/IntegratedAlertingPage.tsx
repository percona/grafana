import React, { FC, useEffect, useState } from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { hot } from 'react-hot-loader';
import { TabsBar, TabContent, Tab, useStyles } from '@grafana/ui';
import { UrlQueryValue, NavModel, NavModelItem } from '@grafana/data';
// import { getNavModel } from 'app/core/selectors/navModel';
import { StoreState } from 'app/types';
import { updateLocation } from 'app/core/actions';
import { Messages } from './IntegratedAlerting.messages';
import { getStyles } from './IntegratedAlerting.styles';
import { TabKeys } from './IntegratedAlerting.types';
import { Alerts, AlertRuleTemplate, AlertRules, NotificationChannel } from './components';
import { DEFAULT_TAB } from './integratedAlerting.constants';

interface ConnectedProps {
  tabKey?: UrlQueryValue;
  navModel: NavModel;
}

interface DispatchProps {
  updateLocation: typeof updateLocation;
}

const tabs = [
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
];

const isValidTab = (tab: UrlQueryValue) => Object.values(TabKeys).includes(tab as TabKeys);

const IntegratedAlertingPage: FC<DispatchProps & ConnectedProps> = ({ tabKey, navModel, updateLocation }) => {
  const styles = useStyles(getStyles);
  const [activeTab, setActiveTab] = useState<TabKeys>(DEFAULT_TAB);

  useEffect(() => {
    isValidTab(tabKey) || selectTab(DEFAULT_TAB);
  }, []);

  useEffect(() => {
    setActiveTab(isValidTab(tabKey) ? (tabKey as TabKeys) : DEFAULT_TAB);
  }, [tabKey]);

  const selectTab = (tabKey: TabKeys) => {
    updateLocation({ query: { tab: tabKey }, partial: true });
  };

  return (
    <div className={styles.integratedAlertingWrapper}>
      <TabsBar>
        {tabs.map(tab => (
          <Tab key={tab.key} label={tab.label} active={tab.key === activeTab} onChangeTab={() => selectTab(tab.key)} />
        ))}
      </TabsBar>
      <TabContent>{tabs.find(tab => tab.key === activeTab).component}</TabContent>
    </div>
  );
};

const getChild = (tabKey: TabKeys, activeTab: TabKeys): NavModelItem => ({
  active: activeTab === tabKey,
  icon: '',
  id: tabKey,
  text: Messages.tabs[tabKey],
  url: `integrated-alerting?tab=${tabKey}`,
});

export const getNavModel = (activeTab: TabKeys): NavModel => {
  const main = {
    icon: 'list-ul',
    id: 'integrated-alerting',
    text: '',
    url: '',
    subTitle: '',
    breadcrumbs: [{ title: 'Integrated Alerting', url: 'integrated-alerting' }],
    children: tabs.map(tab => getChild(tab.key, activeTab)),
  };

  return {
    main,
    node: main,
  };
};

const mapStateToProps: MapStateToProps<ConnectedProps, {}, StoreState> = (state: StoreState) => {
  const tabKey = state.location.query.tab;

  console.log(state.navIndex);

  return {
    // navModel: getNavModel(state.navIndex, `integrated-alerting`),
    navModel: getNavModel(tabKey as TabKeys),
    tabKey,
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = {
  updateLocation,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(IntegratedAlertingPage));

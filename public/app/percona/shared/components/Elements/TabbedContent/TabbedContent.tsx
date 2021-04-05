import React, { FC, useEffect } from 'react';
import { UrlQueryValue } from '@grafana/data';
import { getLocationSrv } from '@grafana/runtime';
import { Tab, TabContent, TabsBar, useStyles } from '@grafana/ui';
import { StoreState } from 'app/types';
import { useSelector } from 'react-redux';
import { TabbedContentProps } from './TabbedContent.types';
import { getStyles } from './TabbedContent.styles';

export const TabbedContent: FC<TabbedContentProps> = ({ tabs = [], basePath }) => {
  const styles = useStyles(getStyles);
  const defaultTab = tabs[0].key;
  const tabKeys = tabs.map(tab => tab.key);
  const activeTab = useSelector((state: StoreState) => state.location.routeParams.tab);
  const isSamePage = useSelector((state: StoreState) => state.location.path.includes(basePath));
  const isValidTab = (tab: UrlQueryValue) => Object.values(tabKeys).includes(tab?.toString() || '');

  const selectTab = (tabKey: string) => {
    getLocationSrv().update({
      path: `${basePath}/${tabKey}`,
    });
  };

  useEffect(() => {
    if (!isSamePage) {
      return;
    }
    isValidTab(activeTab) || selectTab(defaultTab);
  }, []);

  return (
    <>
      <TabsBar>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            active={tab.key === activeTab}
            style={tab.disabled ? styles.disabled : undefined}
            onChangeTab={() => selectTab(tab.key)}
          />
        ))}
      </TabsBar>
      <TabContent>{tabs.find(tab => tab.key === activeTab)?.component()}</TabContent>
    </>
  );
};

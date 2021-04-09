import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getLocationSrv } from '@grafana/runtime';
import { Tab, TabContent, TabsBar, useStyles } from '@grafana/ui';
import { StoreState } from 'app/types';
import { ContentTab, TabbedContentProps } from './TabbedContent.types';
import { getStyles } from './TabbedContent.styles';

export const TabbedContent: FC<TabbedContentProps> = ({ tabs = [], basePath, renderTab }) => {
  const styles = useStyles(getStyles);
  const routeUpdated = useRef(false);
  const defaultTab = tabs[0].key;
  const tabKeys = tabs.map(tab => tab.key);
  const activeTab = useSelector((state: StoreState) => tabs.find(tab => tab.key === state.location.routeParams.tab));
  const isValidTab = (tab?: ContentTab) => Object.values(tabKeys).includes(tab?.key || '');

  const selectTab = (tabKey: string) => {
    if (tabKey !== activeTab?.key) {
      routeUpdated.current = true;
      getLocationSrv().update({
        path: `/${basePath}/${tabKey}`,
      });
    }
  };

  useEffect(() => {
    isValidTab(activeTab) || selectTab(defaultTab);
  }, []);

  return (
    <>
      <TabsBar>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            active={tab.key === activeTab?.key}
            style={tab.disabled ? styles.disabled : undefined}
            onChangeTab={() => selectTab(tab.key)}
          />
        ))}
      </TabsBar>
      {routeUpdated.current ? null : renderTab ? (
        renderTab({ Content: () => <TabContent>{activeTab?.component}</TabContent>, tab: activeTab })
      ) : (
        <TabContent>{activeTab?.component}</TabContent>
      )}
    </>
  );
};

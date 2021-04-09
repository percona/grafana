import React, { FC } from 'react';
import { Tab, TabsBar, useStyles } from '@grafana/ui';
import { TabOrientation } from '../TabbedContent.types';
import { TabsVertical } from 'app/percona/shared/components/Elements/TabsVertical/TabsVertical';
import { OrientedTabContentProps, OrientedTabsProps } from './OrientedTabs.types';
import { getStyles } from './OrientedTabs.styles';

const OrientedTabContent: FC<OrientedTabContentProps> = ({ tabs, activeTabKey, tabClick = () => null }) => {
  const styles = useStyles(getStyles);

  return (
    <>
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          active={tab.key === activeTabKey}
          style={tab.disabled ? styles.disabled : undefined}
          onChangeTab={() => tabClick(tab.key)}
        />
      ))}
    </>
  );
};

export const OrientedTabs: FC<OrientedTabsProps> = ({
  orientation = TabOrientation.Horizontal,
  tabs = [],
  activeTabKey,
  tabClick = () => null,
}) =>
  orientation === TabOrientation.Horizontal ? (
    <TabsBar>
      <OrientedTabContent tabs={tabs} activeTabKey={activeTabKey} tabClick={tabClick} />
    </TabsBar>
  ) : (
    <TabsVertical>
      <OrientedTabContent tabs={tabs} activeTabKey={activeTabKey} tabClick={tabClick} />
    </TabsVertical>
  );

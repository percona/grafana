import { Tab, TabContent, TabsBar, useStyles } from '@grafana/ui';
import React, { FC, useState } from 'react';
import { Messages } from './Backup.messages';
import { TabKeys } from './Backup.types';
import { getStyles } from './Backup.styles';
import { StorageLocations } from './components/StorageLocations';

const BackupPage: FC = () => {
  const [activeTab, setActiveTab] = useState(TabKeys.locations);
  const tabs = [
    {
      label: Messages.tabs.locations,
      key: TabKeys.locations,
      component: <StorageLocations />,
    },
  ];
  const styles = useStyles(getStyles);

  return (
    <div className={styles.backupWrapper}>
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
    </div>
  );
};

export default BackupPage;

import React, { FC, useMemo } from 'react';
import { useStyles } from '@grafana/ui';
import { Breadcrumb } from 'app/core/components/Breadcrumb';
import { TabbedContent, ContentTab } from '../shared/components/Elements/TabbedContent';
import { TechnicalPreview } from '../shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { TabKeys } from './Backup.types';
import { getStyles } from './Backup.styles';
import { StorageLocations } from './components/StorageLocations';
import { PAGE_MODEL } from './BackupPage.constants';
import { Messages } from './Backup.messages';

const BackupPage: FC = () => {
  const styles = useStyles(getStyles);
  const tabs: ContentTab[] = useMemo(
    (): ContentTab[] => [
      {
        key: TabKeys.locations,
        label: Messages.tabs.locations,
        component: () => <StorageLocations />,
      },
    ],
    []
  );

  const { path: basePath } = PAGE_MODEL;

  return (
    <div className={styles.backupWrapper}>
      <Breadcrumb pageModel={PAGE_MODEL} />
      <TechnicalPreview />
      <TabbedContent tabs={tabs} basePath={basePath} />;
    </div>
  );
};

export default BackupPage;

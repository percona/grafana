import React, { FC } from 'react';

import { useStyles } from '@grafana/ui';
import { BackupStatus } from 'app/percona/backup/Backup.types';

import { DBIcon } from '../../DBIcon';

import { Messages } from './BackupInventoryActions.messages';
import { getStyles } from './BackupInventoryActions.styles';
import { BackupInventoryActionsProps } from './BackupInventoryActions.types';
import { MultipleActions } from 'app/percona/dbaas/components/MultipleActions';

export const BackupInventoryActions: FC<BackupInventoryActionsProps> = ({ backup, onRestore, onBackup, onDelete }) => {
  const styles = useStyles(getStyles);
  const handeClick = () => onRestore(backup);
  const handleBackup = () => onBackup(backup);
  const handleDelete = () => onDelete(backup);

  const getActions = [
    {
      title: (
        <div className={styles.dropdownField}>
          <DBIcon type="restore" data-testid="restore-backup-artifact-button" role="button" />
          {Messages.restoreBackup}
        </div>
      ),
      disabled: backup.status !== BackupStatus.BACKUP_STATUS_SUCCESS,
      action: handeClick,
    },
    {
      title: (
        <div className={styles.dropdownField}>
          <DBIcon type="backup" data-testid="add-backup-artifact-button" role="button" />
          {Messages.addBackup}
        </div>
      ),
      action: handleBackup,
    },
    {
      title: (
        <div className={styles.dropdownField}>
          <DBIcon type="delete" data-testid="delete-backup-artifact-button" role="button" />
          {Messages.restoreBackup}
        </div>
      ),
      disabled:
        backup.status === BackupStatus.BACKUP_STATUS_IN_PROGRESS ||
        backup.status === BackupStatus.BACKUP_STATUS_PENDING ||
        backup.status === BackupStatus.BACKUP_STATUS_DELETING,
      action: handleDelete,
    },
  ];

  return (
    <div className={styles.actionsWrapper}>
      <MultipleActions actions={getActions} dataTestId="dbcluster-actions" />
    </div>
  );
};

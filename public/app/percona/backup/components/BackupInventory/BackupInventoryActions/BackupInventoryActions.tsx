import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { DBIcon } from '../../DBIcon';
import { BackupInventoryActionsProps } from './BackupInventoryActions.types';
import { getStyles } from './BackupInventoryActions.styles';
import { Messages } from './BackupInventoryActions.messages';

export const BackupInventoryActions: FC<BackupInventoryActionsProps> = ({ backup, onRestore }) => {
  const styles = useStyles(getStyles);
  const handeClick = () => onRestore(backup);

  return (
    <div className={styles.actionsWrapper}>
      <DBIcon
        tooltipText={Messages.restoreBackup}
        type="restore"
        data-qa="restore-backup-artifact-button"
        role="button"
        onClick={handeClick}
      />
    </div>
  );
};

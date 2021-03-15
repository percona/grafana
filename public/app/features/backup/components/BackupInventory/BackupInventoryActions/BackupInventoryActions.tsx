import React, { FC } from 'react';
import { DBIcon } from '../../DBIcon';
import { BackupInventoryActionsProps } from './BackupInventoryActions.types';

export const BackupInventoryActions: FC<BackupInventoryActionsProps> = ({ backup, onRestore }) => {
  const handeClick = () => onRestore(backup);
  return (
    <div>
      <DBIcon type="restore" data-qa="restore-backup-artifact-button" role="button" onClick={handeClick} />
    </div>
  );
};

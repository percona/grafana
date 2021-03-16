import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { BackupInventoryDetailsProps } from './BackupInventoryDetails.types';
import { Messages } from './BackupInventoryDetails.messages';
import { getStyles } from './BackupInventoryDetails.styles';

export const BackupInventoryDetails: FC<BackupInventoryDetailsProps> = ({ name, status, dataModel }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.detailsWrapper} data-qa="backup-artifact-details-wrapper">
      <span data-qa="backup-artifact-details-name">
        <span>{Messages.backupName}</span> <span>{name}</span>
      </span>
      <span data-qa="backup-artifact-details-status">
        <span>{Messages.testResuts}</span> <span>{status}</span>
      </span>
      <span>
        <span data-qa="backup-artifact-details-data-model">{Messages.dataModel}</span> <span>{dataModel}</span>
      </span>
    </div>
  );
};

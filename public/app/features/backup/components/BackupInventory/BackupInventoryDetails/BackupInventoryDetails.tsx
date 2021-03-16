import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { BackupInventoryDetailsProps } from './BackupInventoryDetails.types';
import { formatDataModel, formatStatus } from '../BackupInventory.utils';
import { Messages } from './BackupInventoryDetails.messages';
import { getStyles } from './BackupInventoryDetails.styles';
export const BackupInventoryDetails: FC<BackupInventoryDetailsProps> = ({ name, status, dataModel }) => {
  const styles = useStyles(getStyles);
  const statusMsg = formatStatus(status);
  const dataModelMsg = formatDataModel(dataModel);

  return (
    <div className={styles.detailsWrapper} data-qa="backup-artifact-details-wrapper">
      <span data-qa="backup-artifact-details-name">
        <span>{Messages.backupName}</span> <span>{name}</span>
      </span>
      <span data-qa="backup-artifact-details-status">
        <span>{Messages.testResuts}</span> <span>{statusMsg}</span>
      </span>
      <span>
        <span data-qa="backup-artifact-details-data-model">{Messages.dataModel}</span> <span>{dataModelMsg}</span>
      </span>
    </div>
  );
};

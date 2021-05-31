import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { formatDataModel } from 'app/percona/backup/Backup.utils';
import { ScheduledBackupDetailsProps } from './ScheduledBackupsDetails.types';
import { Messages } from './ScheduledBackupsDetails.messages';
import { getStyles } from './ScheduledBackupsDetails.styles';

export const ScheduledBackupDetails: FC<ScheduledBackupDetailsProps> = ({ name, description, dataModel }) => {
  const styles = useStyles(getStyles);
  const dataModelMsg = formatDataModel(dataModel);

  return (
    <div className={styles.detailsWrapper} data-qa="restore-details-wrapper">
      <span data-qa="restore-details-name">
        <span className={styles.detailLabel}>{Messages.backupName}</span> <span>{name}</span>
      </span>
      <span data-qa="restore-details-description">
        <span className={styles.detailLabel}>{Messages.description}</span> <span>{description}</span>
      </span>
      <span data-qa="restore-details-data-model">
        <span className={styles.detailLabel}>{Messages.dataModel}</span> <span>{dataModelMsg}</span>
      </span>
    </div>
  );
};

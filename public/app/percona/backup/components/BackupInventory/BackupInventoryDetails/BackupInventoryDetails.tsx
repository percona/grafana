import { FC } from 'react';

import { useStyles } from '@grafana/ui';
import { formatDataModel } from 'app/percona/backup/Backup.utils';

import { Messages } from './BackupInventoryDetails.messages';
import { getStyles } from './BackupInventoryDetails.styles';
import { BackupInventoryDetailsProps } from './BackupInventoryDetails.types';

export const BackupInventoryDetails: FC<BackupInventoryDetailsProps> = ({ name, folder, dataModel, compression }) => {
  const styles = useStyles(getStyles);
  const dataModelMsg = formatDataModel(dataModel);

  return (
    <div className={styles.detailsWrapper} data-testid="backup-artifact-details-wrapper">
      <span data-testid="backup-artifact-details-name">
        <span className={styles.detailLabel}>{Messages.backupName}</span> <span>{name}</span>
      </span>
      <span data-testid="backup-artifact-details-data-model">
        <span className={styles.detailLabel}>{Messages.dataModel}</span> <span>{dataModelMsg}</span>
      </span>
      {folder && (
        <span data-testid="backup-artifact-details-folder">
          <span className={styles.detailLabel}>{Messages.folder}</span> <span>{folder}</span>
        </span>
      )}
      {compression && (
        <span data-testid="backup-artifact-details-compression">
          <span className={styles.detailLabel}>{Messages.compression}</span> <span>{compression}</span>
        </span>
      )}
    </div>
  );
};

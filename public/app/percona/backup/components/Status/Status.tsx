import React, { FC } from 'react';
import { useTheme } from '@grafana/ui';
import { formatStatus } from '../../Backup.utils';
import { StatusProps } from './Status.types';
import { getStyles } from './Status.styles';
import { BackupStatus, RestoreStatus } from '../../Backup.types';
import { Ellipsis } from 'app/percona/shared/components/Elements/Icons';

const pendingStates = [
  BackupStatus.BACKUP_STATUS_PENDING,
  BackupStatus.BACKUP_STATUS_IN_PROGRESS,
  RestoreStatus.RESTORE_STATUS_IN_PROGRESS,
];

export const Status: FC<StatusProps> = ({ status }) => {
  const statusMsg = formatStatus(status);
  const theme = useTheme();
  const styles = getStyles(theme, status);
  const isPending = pendingStates.includes(status);

  return isPending ? (
    <span className={styles.ellipsisContainer}>
      <Ellipsis />
    </span>
  ) : (
    <span data-qa="statusMsg" className={styles.status}>
      {statusMsg}
    </span>
  );
};

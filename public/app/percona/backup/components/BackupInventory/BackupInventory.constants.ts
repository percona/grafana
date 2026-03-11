import { Messages } from '../../Backup.messages';
import { BackupStatus } from '../../Backup.types';

export const LIST_ARTIFACTS_CANCEL_TOKEN = 'listArtifacts';
export const BACKUP_CANCEL_TOKEN = 'backup';
export const RESTORE_CANCEL_TOKEN = 'restore';
export const LOGS_LIMIT = 50;
export const DAY_FORMAT = 'yyyy-MM-DD';
export const HOUR_FORMAT = 'HH:mm:ss';

export const STATUS_FILTER_OPTIONS = [
  {
    label: Messages.backupInventory.table.columns.status.options.success,
    value: BackupStatus.BACKUP_STATUS_SUCCESS,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.error,
    value: BackupStatus.BACKUP_STATUS_ERROR,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.pending,
    value: BackupStatus.BACKUP_STATUS_PENDING,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.paused,
    value: BackupStatus.BACKUP_STATUS_PAUSED,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.invalid,
    value: BackupStatus.BACKUP_STATUS_INVALID,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.inProgress,
    value: BackupStatus.BACKUP_STATUS_IN_PROGRESS,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.failedToDelete,
    value: BackupStatus.BACKUP_STATUS_FAILED_TO_DELETE,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.failedNotSupportedByAgent,
    value: BackupStatus.BACKUP_STATUS_FAILED_NOT_SUPPORTED_BY_AGENT,
  },
  {
    label: Messages.backupInventory.table.columns.status.options.deleting,
    value: BackupStatus.BACKUP_STATUS_DELETING,
  },
];

export enum TabKeys {
  inventory = 'inventory',
  scheduled = 'scheduled',
  locations = 'locations',
  restore = 'restore',
}

export enum DataModel {
  DATA_MODEL_INVALID = 'DATA_MODEL_INVALID',
  PHYSICAL = 'PHYSICAL',
  LOGICAL = 'LOGICAL',
}

export enum BackupStatus {
  BACKUP_STATUS_INVALID = 'BACKUP_STATUS_INVALID',
  BACKUP_STATUS_PENDING = 'BACKUP_STATUS_PENDING',
  BACKUP_STATUS_IN_PROGRESS = 'BACKUP_STATUS_IN_PROGRESS',
  BACKUP_STATUS_PAUSED = 'BACKUP_STATUS_PAUSED',
  BACKUP_STATUS_SUCCESS = 'BACKUP_STATUS_SUCCESS',
  BACKUP_STATUS_ERROR = 'BACKUP_STATUS_ERROR',
  BACKUP_STATUS_DELETING = 'BACKUP_STATUS_DELETING',
  BACKUP_STATUS_FAILED_TO_DELETE = 'BACKUP_STATUS_FAILED_TO_DELETE',
}

export enum RestoreStatus {
  RESTORE_STATUS_INVALID = 'RESTORE_STATUS_INVALID',
  RESTORE_STATUS_IN_PROGRESS = 'RESTORE_STATUS_IN_PROGRESS',
  RESTORE_STATUS_SUCCESS = 'RESTORE_STATUS_SUCCESS',
  RESTORE_STATUS_ERROR = 'RESTORE_STATUS_ERROR',
}

export enum RetryMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export enum BackupType {
  FULL = 'Full',
  INCREMENTAL = 'Incremental',
}

export interface RawBackupLog {
  chunk_id: number;
  data: string;
  time: string;
}

export interface BackupLogResponse {
  logs: RawBackupLog[];
  end: boolean;
}

export interface BackupLogChunk extends Omit<RawBackupLog, 'chunk_id'> {
  id: number;
}

export interface BackupLogs {
  logs: BackupLogChunk[];
  end: boolean;
}

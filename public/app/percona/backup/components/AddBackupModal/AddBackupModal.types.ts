import { SelectableValue } from '@grafana/data';
import { DataModel, RetryMode } from 'app/percona/backup/Backup.types';
import { Databases } from 'app/percona/shared/core';
import { Backup } from '../BackupInventory/BackupInventory.types';

export interface AddBackupModalProps {
  backup: Backup | null;
  isVisible: boolean;
  scheduleMode?: boolean;
  onClose: () => void;
  onBackup: (values: AddBackupFormProps) => void;
}

export interface SelectableService {
  vendor: Databases;
  id: string;
}

export interface AddBackupFormProps {
  service: SelectableValue<SelectableService>;
  dataModel: DataModel;
  backupName: string;
  description: string;
  location: SelectableValue<string>;
  retryMode: RetryMode;
  retryTimes: number;
  retryInterval: number;
}

import { SelectableValue } from '@grafana/data';
import { Databases } from 'app/percona/shared/core';
import { Backup, DataModel } from '../BackupInventory.types';

export interface AddBackupModalProps {
  backup: Backup | null;
  isVisible: boolean;
  onClose: () => void;
}

export enum RetryMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export interface AddBackupFormProps {
  service: SelectableValue<string>;
  vendor: Databases;
  dataModel: DataModel;
  backupName: string;
  description: string;
  location: SelectableValue<string>;
  retryMode: RetryMode;
  retryTimes: number;
  retryInterval: number;
}

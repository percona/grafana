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
  serviceName: string;
  vendor: string;
  dataModel: DataModel;
  databases: string[];
  backupName: string;
  description: string;
  location: string;
  retryMode: RetryMode;
  retryTimes: number;
  retryInterval: number;
}

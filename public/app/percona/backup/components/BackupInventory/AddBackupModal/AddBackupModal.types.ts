import { Backup } from '../BackupInventory.types';

export interface AddBackupModalProps {
  backup: Backup | null;
  isVisible: boolean;
  onClose: () => void;
}

export enum RetryMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

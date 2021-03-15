import { Backup } from '../BackupInventory.types';

export interface RestoreBackupModalProps {
  isVisible: boolean;
  backup: Backup;
}

export interface RestoreBackupFormProps {
  serviceName: string;
  vendor: string;
  dataModel: string;
}

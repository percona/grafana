import { Backup } from '../BackupInventory.types';

export interface RestoreBackupModalProps {
  isVisible: boolean;
  backup: Backup | null;
  onClose: () => void;
}

export interface RestoreBackupFormProps {
  serviceType: ServiceTypeSelect;
  vendor: string;
  serviceName: string;
  dataModel: string;
}

export enum ServiceTypeSelect {
  SAME = 'SAME',
  COMPATIBLE = 'COMPATIBLE',
}

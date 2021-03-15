import { Backup } from '../BackupInventory.types';

export interface BackupInventoryActionsProps {
  backup: Backup;
  onRestore: (backup: Backup) => void;
}

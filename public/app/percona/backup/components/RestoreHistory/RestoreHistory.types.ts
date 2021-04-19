import { RestoreStatus } from '../../Backup.types';
import { Backup, RawBackup } from '../BackupInventory/BackupInventory.types';

export interface RawRestore extends Omit<RawBackup, 'artifact_id' | 'created_at'> {
  restore_id: string;
  started_at: string;
  finished_at: string;
}

export interface RestoreResponse {
  items: RawRestore[];
}

export interface Restore extends Omit<Backup, 'created' | 'status'> {
  started: number;
  finished: number;
  status: RestoreStatus;
}

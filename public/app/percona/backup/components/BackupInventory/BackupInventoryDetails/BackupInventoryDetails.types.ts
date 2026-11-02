import { BackupStatus, Compression, DataModel, RestoreStatus } from 'app/percona/backup/Backup.types';

export interface BackupInventoryDetailsProps {
  name: string;
  status: BackupStatus | RestoreStatus;
  dataModel: DataModel;
  folder: string;
  compression: Compression;
}

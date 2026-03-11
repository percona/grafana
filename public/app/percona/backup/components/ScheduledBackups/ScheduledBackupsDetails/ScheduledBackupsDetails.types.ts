import { Compression, DataModel } from 'app/percona/backup/Backup.types';

export interface ScheduledBackupDetailsProps {
  name: string;
  description: string;
  dataModel: DataModel;
  cronExpression: string;
  folder: string;
  compression: Compression;
}

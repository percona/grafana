import { BackupLogs } from 'app/percona/backup/Backup.types';
import { CancelToken } from 'axios';

export interface BackupLogsModalProps {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  getLogChunks: (startingChunk: number, offset: number, token?: CancelToken) => Promise<BackupLogs>;
}

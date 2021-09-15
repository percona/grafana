import { BackupLogs } from 'app/percona/backup/Backup.types';

export interface BackupLogsModalProps {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  getLogChunks: (startingChunk: number, offset: number) => Promise<BackupLogs>;
}

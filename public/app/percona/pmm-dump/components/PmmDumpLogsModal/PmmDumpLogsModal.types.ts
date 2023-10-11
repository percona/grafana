import { CancelToken } from 'axios';

import { BackupLogs } from 'app/percona/backup/Backup.types';

export interface PmmDumpModalProps {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  getLogChunks: (offset: number, limit: number, token?: CancelToken) => Promise<BackupLogs>;
}

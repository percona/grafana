import { BackupLogs } from '../../Backup.types';

export interface ChunkedLogsViewerProps {
  onMore?: () => void;
  getLogChunks: (startingChunk: number, offset: number) => Promise<BackupLogs>;
}

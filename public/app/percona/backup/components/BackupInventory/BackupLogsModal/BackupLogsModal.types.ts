export interface BackupLogsModalProps {
  isVisible: boolean;
  logs: string;
  title: string;
  loadingLogs: boolean;
  onClose: () => void;
  onUpdateLogs: () => void;
}

import { Messages } from './BackupLogsModal.messages';

export const getLogsContent = (logs: string, loading: boolean) => {
  if (loading) {
    return !!logs.length ? `${logs}\n${Messages.loading}` : Messages.loading;
  }

  return logs.length ? logs : Messages.noLogs;
};

export const Messages = {
  serviceName: 'Service name',
  vendor: 'Vendor',
  dataModel: 'Data model',
  type: 'Backup type',
  databases: 'Databases',
  backupName: 'Backup name',
  description: 'Description',
  location: 'Location',
  retryMode: 'Retry mode',
  cancelAction: 'Cancel',
  retryTimes: 'Retry, times',
  retryInterval: 'Retry interval, seconds',
  every: 'Every',
  month: 'Month',
  day: 'Day',
  weekDay: 'Weekday',
  startTimeHour: 'Start time (hour)',
  startTimeMinute: 'Start time (minute)',
  fullLogs: 'Full logs',
  enabled: 'Enabled',
  retention: 'Retention (Number of backups - 0 for unlimited)',
  scheduleSection: 'UTC time',
  onDemand: 'On Demand',
  schedule: 'Schedule Backup',
  getModalTitle: (scheduleMode: boolean, edit: boolean) => {
    if (scheduleMode) {
      return edit ? 'Edit Scheduled backup' : 'Create Schedule backup';
    }

    return 'Create Backup on demand';
  },
  getSubmitButtonText: (scheduleMode: boolean, edit: boolean) => {
    if (scheduleMode) {
      return edit ? 'Edit' : 'Schedule';
    }

    return 'Backup';
  },
};

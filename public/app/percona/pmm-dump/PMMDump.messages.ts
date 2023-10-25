export const Messages = {
  services: {
    columns: {
      id: 'Id',
      status: 'Status',
      created: 'Created',
      startDate: 'Start Date',
      endDate: 'End Date',
      timeRange: 'Time Range',
      startTime: 'Start Time',
      endTime: 'End Time',
      nodes: 'Nodes',
    },
    actions: {
      download: 'Download',
      sendToSupport: 'Send to support',
      delete: 'Delete',
      viewLogs: 'View logs',
    },
    emptyTable: 'No dumps available',
    createDataset: 'Create Dataset',
  },
  dumpLogs: {
    getLogsTitle: (name: string) => `Logs for ${name}`,
  },
};

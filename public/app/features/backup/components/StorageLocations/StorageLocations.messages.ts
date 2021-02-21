export const Messages = {
  noData: 'No storage locations found',
  columns: {
    name: 'Name',
    type: 'Type',
    path: 'Endpoint or path',
    labels: 'Labels',
    actions: 'Actions',
  },
  getDeleteMessage: (name: string) => `Are you sure you want to delete the backup location "${name}"?`,
  getDeleteSuccess: (name: string) => `Backup location "${name}" successfully deleted.`,
};

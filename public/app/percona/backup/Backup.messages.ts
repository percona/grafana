export const Messages = {
  tabs: {
    inventory: 'Backup Inventory',
    scheduled: 'Scheduled Backups',
    locations: 'Storage Locations',
    restore: 'Restore History',
  },
  add: 'Add',
  backupManagement: 'Backup Management',
  backupInventory: {
    table: {
      noData: 'No backups found',
      columns: {
        name: 'Backup name',
        created: 'Created',
        location: 'Location',
        vendor: 'Vendor',
        status: 'Status',
        actions: 'Actions',
        type: 'Type',
      },
      status: {
        invalid: 'Invalid',
        pending: 'Pending',
        inProgress: 'In progress',
        paused: 'Paused',
        success: 'Success',
        error: 'Error',
      },
      dataModel: {
        invalid: 'Invalid',
        physical: 'Physical',
        logical: 'Logical',
      },
      actions: 'Actions',
    },
    deleteModalTitle: 'Delete backup artifact',
    deleteFromStorage: 'Delete from storage',
    getLogsTitle: (name: string) => `Backup logs for ${name}`,
    getDeleteMessage: (name: string) => `Are you sure you want to delete "${name}"?`,
  },
  restoreHistory: {
    table: {
      noData: 'No restores found',
      columns: {
        started: 'Started at',
      },
    },
  },
  storageLocations: {
    table: {
      noData: 'No storage locations found',
      columns: {
        name: 'Name',
        type: 'Type',
        path: 'Endpoint or path',
        labels: 'Labels',
        actions: 'Actions',
      },
    },
    addSuccess: 'Backup location was successfully added',
    testSuccess: 'This storage location is valid',
    editSuccess: (name: string) => `Backup location "${name}" was successfully updated`,
    getDeleteSuccess: (name: string) => `Backup location "${name}" successfully deleted.`,
  },
  scheduledBackups: {
    table: {
      noData: 'No scheduled backups found',
      columns: {
        name: 'Name',
        vendor: 'Vendor',
        start: 'Start at',
        retention: 'Retention',
        frequency: 'Frequency',
        location: 'Location',
        lastBackup: 'Last backup (local time)',
        type: 'Type',
        actions: 'Actions',
      },
    },
    deleteModalTitle: 'Delete scheduled backup',
    copyOf: 'Copy of',
    addSuccess: 'Backup successfully scheduled',
    unlimited: 'Unlimited',
    getEditSuccess: (name: string) => `Scheduled backup "${name}" successfully updated`,
    getDeleteSuccess: (name: string) => `Scheduled backup "${name}" successfully deleted.`,
    getDeleteMessage: (name: string) => `Are you sure you want to delete the scheduled backup "${name}"?`,
  },
  status: {
    invalid: 'Invalid',
    pending: 'Pending',
    inProgress: 'In progress',
    deleting: 'Deleting',
    paused: 'Paused',
    success: 'Success',
    error: 'Error',
    failedToDelete: 'Failed to delete',
  },
  dataModel: {
    invalid: 'Invalid',
    physical: 'Physical',
    logical: 'Logical',
  },
  backupMode: {
    full: 'Full',
    incremental: 'Incremental',
    pitr: 'PITR',
    invalid: 'Invalid',
  },
};
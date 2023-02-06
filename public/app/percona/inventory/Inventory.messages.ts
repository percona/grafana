export const Messages = {
  services: {
    tab: {
      add: 'Add service',
      selectBulk: 'Select services to bulk edit them',
      delete: (count: number) => `Delete ${count} ${count === 1 ? 'service' : 'services'}`,
      deleteSuccess: (success: number, count: number) => `${success} of ${count} services successfully deleted`,
    },
    table: {
      name: 'Name',
      type: 'Type',
      id: 'ID',
      nodeId: 'Node ID',
      address: 'Address',
      port: 'Port',
      options: 'Options',
      labels: 'Labels',
      labelsTooltip: 'Useful to define groupings and segment access to build custom user roles.',
      empty: 'No services available',
    },
    multiDelete: {
      title: 'Confirm action',
      description: (count: number) =>
        `Are you sure that you want to permanently delete ${count} ${count === 1 ? 'service' : 'services'}?`,
      forceMode: {
        label: 'Force mode',
        description: 'Force mode is going to delete all associated agents',
      },
      cancel: 'Cancel',
      confirm: 'Proceed',
    },
  },
};

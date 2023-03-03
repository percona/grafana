export const Messages = {
  services: {
    add: 'Add Service',
    forceConfirmation: 'Force mode is going to delete all associated agents',
  },
  agents: {
    goBack: 'Go back to services',
    breadcrumb: (serviceName: string) => `Service ${serviceName} / Agents`,
    noAgents: 'No agents Available',
  },
  nodes: {
    forceConfirmation: 'Force mode is going to delete all agents and services associated with the nodes',
  },
  delete: 'Delete',
  cancel: 'Cancel',
  proceed: 'Proceed',
  forceMode: 'Force mode',
  confirmAction: 'Confirm action',
};

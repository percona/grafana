export const Messages = {
  tabs: {
    services: 'Services',
    agents: 'Agents',
    nodes: 'Nodes',
  },
  removeAgents: (selected: number) =>
    `Are you sure that you want to permanently delete ${selected} ${selected === 1 ? 'agent' : 'agents'}?`,
  removeAgentConfirmation: 'Proceed',
};

export const Messages = {
  title: 'Access Roles',
  subtitle: {
    text: 'Access roles is a way to control the access to metrics and some PMM functionalities, for an increased security standard. Worth noting that every time you invite new users, the default role will be assigned to them. For futher explanation on ',
    link: 'how the Access roles work, check our documentation',
    dot: '.',
  },
  name: {
    column: 'Name',
  },
  description: {
    column: 'Description',
  },
  metrics: {
    column: 'Metrics access ',
    tooltip: 'Roles are built using service labels. Go to Inventory > Services to edit labels.',
  },
  options: {
    column: 'Options',
    edit: 'Edit',
    default: 'Set as default',
    delete: 'Delete',
  },
  default: {
    text: 'Default',
    tooltip: 'The role that will be applied to new users.',
  },
  delete: {
    title: (role: string) => `Delete "${role}" role`,
    description: (role: string) =>
      `By deleting the role "${role}" all its associated users will need to be transferred to another role. Confirm below the new role for these users.`,
    submit: 'Delete role',
    cancel: 'Cancel',
  },
  create: 'Create',
  noRoles: 'No roles available',
};

export const Messages = {
  fieldSets: {
    advancedSettings: 'Advanced Settings',
    pxcConfiguration: 'MySQL Configurations',
    networkAndSecurity: 'Network and security',
  },
  labels: {
    nodes: 'Number of Nodes',
    resources: 'Resources per Node',
    cpu: 'CPU',
    memory: 'Memory (GB)',
    disk: 'Disk (GB)',
    storageClass: 'Storage Class',
    pxcConfiguration: 'MySQL Configuration',
    expose: 'Expose',
    // exposeTooltip: 'SomeText' TODO 11031 will be added later
    internetFacing: 'Internet Facing',
    // internetFacingTooltip: 'SomeText' TODO 11031 will be added later
    sourceRange: 'Source Range',
  },
  resources: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    custom: 'Custom',
  },

  buttons: {
    addNew: 'Add new',
  },

  tooltips: {
    expose:
      'You will make database cluster available to connect from the internet. To limit access you need to specify source ranges',
  },
};

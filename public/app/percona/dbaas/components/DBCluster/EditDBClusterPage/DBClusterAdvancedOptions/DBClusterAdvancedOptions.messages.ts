import { INSTANCE_TYPES_LABELS } from '../../../../../add-instance/panel.types';
import { Databases } from '../../../../../shared/core';

export const Messages = {
  fieldSets: {
    advancedSettings: 'Advanced Settings',
    commonConfiguration: 'Database Configurations',
    configuration: (databaseType: Databases) => `${INSTANCE_TYPES_LABELS[databaseType]} Configurations`,
    networkAndSecurity: 'Network and Security',
  },
  labels: {
    nodes: 'Number of Nodes',
    resources: 'Resources per Node',
    cpu: 'CPU',
    memory: 'Memory (GB)',
    disk: 'Disk (GB)',
    storageClass: 'Storage Class',
    commonConfiguration: 'Database Configuration',
    configuration: (databaseType: Databases) => `${INSTANCE_TYPES_LABELS[databaseType]} Configuration`,
    expose: 'Expose',
    internetFacing: 'Internet Facing',
    sourceRange: 'Source Range',
  },
  resources: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    custom: 'Custom',
  },
  placeholders: {
    storageClass: 'storage class',
  },
};

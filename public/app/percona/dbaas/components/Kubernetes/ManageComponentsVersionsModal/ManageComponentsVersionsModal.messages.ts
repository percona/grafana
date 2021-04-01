import { Operators } from '../../DBCluster/AddDBClusterModal/DBClusterBasicOptions/DBClusterBasicOptions.types';

export const Messages = {
  cancel: 'Cancel',
  fields: {
    component: 'Component',
    versions: 'Versions',
    operator: 'Operator',
  },
  title: 'Manage Components Versions',
  required: 'Required field',
  recommended: 'Recommended',
  save: 'Save',
  success: 'Components versions updated successfully',
  operatorLabel: {
    [Operators.xtradb]: (version: string) => `PXC ${version}`,
    [Operators.psmdb]: (version: string) => `PSMDB ${version}`,
  },
  componentLabel: {
    pxc: 'PXC',
    proxysql: 'ProxySQL',
    backup: 'Backup',
    mongod: 'PSMDB',
  },
};

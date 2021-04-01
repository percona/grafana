export const versionsStubs = [
  { name: 'v1.0', value: true, label: '1.0', status: 'available' },
  { name: 'v2.0', value: true, label: '2.0', status: 'recommended' },
];

export const initialValuesStubs = {
  operator: { name: 'psmdb', value: 'psmdb', label: 'PSMDB 1' },
  component: { name: 'mongod', value: 'mongod', label: 'PSMDB' },
  psmdbbackup: versionsStubs,
  psmdbmongod: versionsStubs,
  xtradbpxc: versionsStubs,
  xtradbproxysql: versionsStubs,
  xtradbbackup: versionsStubs,
};

export const possibleComponentOptionsStubs = {
  psmdb: [
    { name: 'mongod', value: 'mongod', label: 'PSMDB' },
    { name: 'backup', value: 'backup', label: 'Backup' },
  ],
  xtradb: [
    { name: 'pxc', value: 'pxc', label: 'PXC' },
    { name: 'proxysql', value: 'proxysql', label: 'ProxySQL' },
    { name: 'backup', value: 'backup', label: 'Backup' },
  ],
};

export const operatorsOptionsStubs = [
  { name: 'psmdb', value: 'psmdb', label: 'PSMDB 1' },
  { name: 'xtradb', value: 'xtradb', label: 'PXC 1' },
];

export const psmdbComponentOptionsStubs = [
  { name: 'mongod', value: 'mongod', label: 'PSMDB' },
  { name: 'backup', value: 'backup', label: 'Backup' },
];

export const versionsFieldNameStub = 'psmdbmongod';

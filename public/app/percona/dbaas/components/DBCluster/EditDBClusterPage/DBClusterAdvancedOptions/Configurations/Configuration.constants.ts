import { Databases } from 'app/percona/shared/core';
export const PXCDefaultConfiguration =
  'Configuration:                 [mysqld]\n' +
  'wsrep_provider_options="gcache.size=600M"\n' +
  "wsrep_trx_fragment_unit='bytes'\n" +
  'wsrep_trx_fragment_size=3670018';
export const PSMDBDefaultConfiguration = ' Configuration:  \n' + '      operationProfiling:\n' + '        mode: slowOp';

export const DefaultDatabaseConfiguration: Partial<Record<Databases, string>> = {
  [Databases.mysql]: PXCDefaultConfiguration,
  [Databases.mongodb]: PSMDBDefaultConfiguration,
};

import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';

import { Operators } from './AddDBClusterModal/DBClusterBasicOptions/DBClusterBasicOptions.types';
import {
  ClusterDatabaseTypeMap,
  DatabaseClusterTypeMap,
  DatabaseOperatorsMap,
  DBClusterServiceDatabasesMap,
  DBClusterType,
} from './DBCluster.types';
import { PSMDBService } from './PSMDB.service';
import { XtraDBService } from './XtraDB.service';

export const ADVANCED_SETTINGS_URL = '/graph/settings/advanced-settings';

export const DATABASE_OPTIONS = [
  {
    value: Databases.mysql,
    label: DATABASE_LABELS.mysql,
  },
  {
    value: Databases.mongodb,
    label: DATABASE_LABELS.mongodb,
  },
];

export const SERVICE_MAP: Partial<DBClusterServiceDatabasesMap> = {
  [Databases.mysql]: new XtraDBService(),
  [Databases.mongodb]: new PSMDBService(),
};

export const THOUSAND = 1000;
export const BILLION = 10 ** 9;
export const RESOURCES_PRECISION = 2;

export const DATABASE_OPERATORS: Partial<DatabaseOperatorsMap> = {
  [Operators.pxc]: Databases.mysql,
  [Operators.psmdb]: Databases.mongodb,
};

export const DATABASE_CLUSTER_TYPE: Partial<DatabaseClusterTypeMap> = {
  [DBClusterType.pxc]: Databases.mysql,
  [DBClusterType.psmdb]: Databases.mongodb,
};

export const CLUSTER_TYPE_DATABASE: Partial<ClusterDatabaseTypeMap> = {
  [Databases.mysql]: DBClusterType.pxc,
  [Databases.mongodb]: DBClusterType.psmdb,
};

export const GET_CLUSTERS_CANCEL_TOKEN = 'getClusters';

import { Databases } from 'app/percona/shared/core';
import { DBClusterService } from './DBCluster.service';
import { XtraDBService } from './XtraDB.service';
import { PSMDBService } from './PSMDB.service';
import { DBClusterServiceDatabasesMap } from './DBCluster.types';

const SERVICE_MAP: Partial<DBClusterServiceDatabasesMap> = {
  [Databases.mysql]: new XtraDBService(),
  [Databases.mongodb]: new PSMDBService(),
};

export class DBClusterServiceFactory {
  static newDBClusterService(type: Databases): DBClusterService {
    const service = SERVICE_MAP[type];

    return service || SERVICE_MAP[Databases.mysql];
  }
}

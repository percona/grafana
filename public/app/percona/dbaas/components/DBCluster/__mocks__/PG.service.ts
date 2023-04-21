import {
  dbClusterExpectedResourcesStub,
  pgDBClusterConnectionStub,
  pgComponentsVersionsStubs,
} from './dbClustersStubs';

export class PGService {
  getDBClusterCredentials() {
    return { connection_credentials: pgDBClusterConnectionStub };
  }

  restartDBCluster() {}

  getExpectedResources() {
    return Promise.resolve(dbClusterExpectedResourcesStub);
  }

  getComponents() {
    return Promise.resolve(pgComponentsVersionsStubs);
  }

  updateDBCluster() {
    return Promise.resolve();
  }
}

import {
  dbClusterExpectedResourcesStub,
  xtraDBClusterConnectionStub,
  xtradbComponentsVersionsStubs,
} from './dbClustersStubs';

export class XtraDBService {
  getDBClusterCredentials() {
    return { connection_credentials: xtraDBClusterConnectionStub };
  }

  restartDBCluster() {}

  getExpectedResources() {
    return Promise.resolve(dbClusterExpectedResourcesStub);
  }

  getComponents() {
    return Promise.resolve(xtradbComponentsVersionsStubs);
  }
}

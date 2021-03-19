import { SelectableValue } from '@grafana/data';
import { Databases } from 'app/percona/shared/core';
import { apiManagement, api } from 'app/percona/shared/helpers/api';
import { Kubernetes } from '../Kubernetes/Kubernetes.types';
import {
  DBCluster,
  DBClusterPayload,
  DBClusterConnectionAPI,
  DBClusterLogsAPI,
  DBClusterAllocatedResources,
  DBClusterAllocatedResourcesAPI,
} from './DBCluster.types';

export abstract class DBClusterService {
  abstract getDBClusters(kubernetes: Kubernetes): Promise<DBClusterPayload>;

  abstract addDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract updateDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract suspendDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract resumeDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract deleteDBClusters(dbCluster: DBCluster): Promise<void>;

  abstract getDBClusterCredentials(dbCluster: DBCluster): Promise<void | DBClusterConnectionAPI>;

  abstract restartDBCluster(dbCluster: DBCluster): Promise<void>;

  abstract toModel(dbCluster: DBClusterPayload, kubernetesClusterName: string, databaseType: Databases): DBCluster;

  static async getLogs({ kubernetesClusterName, clusterName }: DBCluster): Promise<DBClusterLogsAPI> {
    return apiManagement.post<DBClusterLogsAPI, any>(
      '/DBaaS/GetLogs',
      {
        kubernetes_cluster_name: kubernetesClusterName,
        cluster_name: clusterName,
      },
      true
    );
  }

  static async getAllocatedResources(kubernetesClusterName: string): Promise<DBClusterAllocatedResources> {
    return apiManagement
      .post<DBClusterAllocatedResourcesAPI, any>('/DBaaS/Kubernetes/Resources/Get', {
        kubernetes_cluster_name: kubernetesClusterName,
      })
      .then(response => ({
        total: {
          cpu: response.all.cpu_m / 1000,
          memory: response.all.memory_bytes / 10 ** 9,
          disk: response.all.disk_size / 10 ** 9,
        },
        allocated: {
          cpu: (response.all.cpu_m - response.available.cpu_m) / 1000,
          memory: (response.all.memory_bytes - response.available.memory_bytes) / 10 ** 9,
          disk: (response.all.disk_size - response.available.disk_size) / 10 ** 9,
        },
      }));
  }

  static async getOperatorMatrix({ kubernetesClusterName }: Kubernetes): Promise<any> {
    console.log(kubernetesClusterName);
    return api.get<any, any>('https://check.percona.com/versions/v1/pxc-operator/1.7.0');
  }

  static async getDatabaseVersions(kubernetes: Kubernetes, databaseType: Databases): Promise<SelectableValue[]> {
    console.log(databaseType);
    return this.getOperatorMatrix(kubernetes).then(({ versions }) =>
      Object.keys(versions[0].matrix.pxc).map(version => ({ value: version, label: version }))
    );
  }
}

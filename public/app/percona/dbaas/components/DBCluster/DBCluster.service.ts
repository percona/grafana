import { Databases } from 'app/percona/shared/core';
import { apiManagement } from 'app/percona/shared/helpers/api';
import { Kubernetes } from '../Kubernetes/Kubernetes.types';
import { BILLION, RESOURCES_PRECISION, THOUSAND } from './DBCluster.constants';
import {
  DBCluster,
  DBClusterPayload,
  DBClusterConnectionAPI,
  DBClusterLogsAPI,
  DBClusterAllocatedResources,
  DBClusterAllocatedResourcesAPI,
  DBClusterExpectedResources,
  ResourcesUnits,
  CpuUnits,
} from './DBCluster.types';
import { formatResources } from './DBCluster.utils';

export abstract class DBClusterService {
  abstract getDBClusters(kubernetes: Kubernetes): Promise<DBClusterPayload>;

  abstract addDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract updateDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract suspendDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract resumeDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload>;

  abstract deleteDBClusters(dbCluster: DBCluster): Promise<void>;

  abstract getDBClusterCredentials(dbCluster: DBCluster): Promise<void | DBClusterConnectionAPI>;

  abstract restartDBCluster(dbCluster: DBCluster): Promise<void>;

  abstract getExpectedResources(dbCluster: DBCluster): Promise<DBClusterExpectedResources>;

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
          cpu: { value: response.all.cpu_m / THOUSAND, units: CpuUnits.MILLI },
          memory: { value: response.all.memory_bytes / BILLION, units: ResourcesUnits.GB },
          disk: formatResources(response.all.disk_size, RESOURCES_PRECISION),
        },
        allocated: {
          cpu: { value: (response.all.cpu_m - response.available.cpu_m) / THOUSAND, units: CpuUnits.MILLI },
          memory: {
            value: (response.all.memory_bytes - response.available.memory_bytes) / BILLION,
            units: ResourcesUnits.GB,
          },
          disk: { value: (response.all.disk_size - response.available.disk_size) / BILLION, units: ResourcesUnits.GB },
        },
      }));
  }
}

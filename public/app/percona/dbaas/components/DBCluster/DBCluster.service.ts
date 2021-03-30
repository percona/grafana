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
  DatabaseVersion,
  DBClusterComponentsAPI,
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

  abstract getComponents(kubernetesClusterName: string): Promise<DBClusterComponentsAPI>;

  abstract getDatabaseVersions(kubernetesClusterName: string): Promise<DatabaseVersion[]>;

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
      .then(({ all, available }) => {
        const allocatedCpu = all.cpu_m - available.cpu_m;
        const allocatedMemory = all.memory_bytes - available.memory_bytes;
        const allocatedDisk = all.disk_size - available.disk_size;

        return {
          total: {
            cpu: { value: all.cpu_m / THOUSAND, units: CpuUnits.MILLI, original: +all.cpu_m },
            memory: { value: all.memory_bytes / BILLION, units: ResourcesUnits.GB, original: +all.memory_bytes },
            disk: formatResources(+all.disk_size, RESOURCES_PRECISION),
          },
          allocated: {
            cpu: { value: allocatedCpu / THOUSAND, units: CpuUnits.MILLI, original: allocatedCpu },
            memory: {
              value: allocatedMemory / BILLION,
              units: ResourcesUnits.GB,
              original: allocatedMemory,
            },
            disk: { value: allocatedDisk / BILLION, units: ResourcesUnits.GB, original: allocatedDisk },
          },
        };
      });
  }
}

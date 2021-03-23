import { omit } from 'lodash';
import { Databases } from 'app/percona/shared/core';
import { apiManagement } from 'app/percona/shared/helpers/api';
import { Kubernetes } from '../Kubernetes/Kubernetes.types';
import {
  DatabaseVersion,
  DBCluster,
  DBClusterActionAPI,
  DBClusterComponentsAPI,
  DBClusterConnectionAPI,
  DBClusterPayload,
  DBClusterStatus,
} from './DBCluster.types';
import { DBClusterService } from './DBCluster.service';
import { getClusterStatus } from './DBCluster.utils';

const DBCLUSTER_STATUS_MAP = {
  [DBClusterStatus.invalid]: 'XTRA_DB_CLUSTER_STATE_INVALID',
  [DBClusterStatus.changing]: 'XTRA_DB_CLUSTER_STATE_CHANGING',
  [DBClusterStatus.ready]: 'XTRA_DB_CLUSTER_STATE_READY',
  [DBClusterStatus.failed]: 'XTRA_DB_CLUSTER_STATE_FAILED',
  [DBClusterStatus.deleting]: 'XTRA_DB_CLUSTER_STATE_DELETING',
  [DBClusterStatus.suspended]: 'XTRA_DB_CLUSTER_STATE_PAUSED',
  [DBClusterStatus.unknown]: 'XTRA_DB_CLUSTER_STATE_UNKNOWN',
};

export class XtraDBService extends DBClusterService {
  getDBClusters(kubernetes: Kubernetes): Promise<DBClusterPayload> {
    return apiManagement.post<any, Kubernetes>('/DBaaS/XtraDBClusters/List', kubernetes);
  }

  addDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload> {
    return apiManagement.post<DBClusterPayload, any>('/DBaaS/XtraDBCluster/Create', toAPI(dbCluster));
  }

  updateDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload> {
    return apiManagement.post<DBClusterPayload, any>('/DBaaS/XtraDBCluster/Update', toAPI(dbCluster));
  }

  resumeDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload> {
    return apiManagement.post<DBClusterPayload, any>('/DBaaS/XtraDBCluster/Update', toResumeAPI(dbCluster));
  }

  suspendDBCluster(dbCluster: DBCluster): Promise<void | DBClusterPayload> {
    return apiManagement.post<DBClusterPayload, any>('/DBaaS/XtraDBCluster/Update', toSuspendAPI(dbCluster));
  }

  deleteDBClusters(dbCluster: DBCluster): Promise<void> {
    const toAPI = (cluster: DBCluster): DBClusterActionAPI => ({
      name: cluster.clusterName,
      kubernetes_cluster_name: dbCluster.kubernetesClusterName,
    });

    return apiManagement.post<any, DBClusterActionAPI>('/DBaaS/XtraDBCluster/Delete', toAPI(dbCluster));
  }

  getDBClusterCredentials(dbCluster: DBCluster): Promise<void | DBClusterConnectionAPI> {
    return apiManagement.post<DBClusterConnectionAPI, any>(
      '/DBaaS/XtraDBClusters/GetCredentials',
      omit(toAPI(dbCluster), ['params'])
    );
  }

  restartDBCluster(dbCluster: DBCluster): Promise<void> {
    return apiManagement.post<any, DBClusterActionAPI>(
      '/DBaaS/XtraDBCluster/Restart',
      omit(toAPI(dbCluster), ['params'])
    );
  }

  getComponents(kubernetesClusterName: string): Promise<DBClusterComponentsAPI> {
    return apiManagement.post<DBClusterComponentsAPI, any>('/DBaaS/Components/GetPXC', {
      kubernetes_cluster_name: kubernetesClusterName,
    });
  }

  getDatabaseVersions(kubernetesClusterName: string): Promise<DatabaseVersion[]> {
    return this.getComponents(kubernetesClusterName).then(({ versions }) => {
      return Object.entries(versions[0].matrix.pxc).map(([version, component]) => ({
        value: component.image_path,
        label: version,
        default: !!component.default,
      }));
    });
  }

  toModel(dbCluster: DBClusterPayload, kubernetesClusterName: string, databaseType: Databases): DBCluster {
    return {
      clusterName: dbCluster.name,
      kubernetesClusterName,
      databaseType,
      clusterSize: dbCluster.params.cluster_size,
      memory: (dbCluster.params.pxc?.compute_resources?.memory_bytes || 0) / 10 ** 9,
      cpu: (dbCluster.params.pxc?.compute_resources?.cpu_m || 0) / 1000,
      disk: (dbCluster.params.pxc?.disk_size || 0) / 10 ** 9,
      status: getClusterStatus(dbCluster.state, DBCLUSTER_STATUS_MAP),
      message: dbCluster.operation?.message,
      finishedSteps: dbCluster.operation?.finished_steps || 0,
      totalSteps: dbCluster.operation?.total_steps || 0,
    };
  }
}

const toAPI = (dbCluster: DBCluster): DBClusterPayload => ({
  kubernetes_cluster_name: dbCluster.kubernetesClusterName,
  name: dbCluster.clusterName,
  params: {
    cluster_size: dbCluster.clusterSize,
    pxc: {
      compute_resources: {
        cpu_m: dbCluster.cpu * 1000,
        memory_bytes: dbCluster.memory * 10 ** 9,
      },
      disk_size: dbCluster.disk * 10 ** 9,
      image: dbCluster.databaseImage,
    },
    // Temporary mock data
    proxysql: {
      compute_resources: {
        cpu_m: 1000,
        memory_bytes: 2 * 10 ** 9,
      },
      disk_size: 1 * 10 ** 9,
    },
  },
});

const toSuspendAPI = (dbCluster: DBCluster) => ({
  kubernetes_cluster_name: dbCluster.kubernetesClusterName,
  name: dbCluster.clusterName,
  params: {
    suspend: true,
  },
});

const toResumeAPI = (dbCluster: DBCluster) => ({
  kubernetes_cluster_name: dbCluster.kubernetesClusterName,
  name: dbCluster.clusterName,
  params: {
    resume: true,
  },
});

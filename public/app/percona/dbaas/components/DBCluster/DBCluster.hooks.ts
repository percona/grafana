import { useEffect, useState } from 'react';
import { logger } from '@percona/platform-core';
import { processPromiseResults } from 'app/percona/shared/helpers/promises';
import { Databases } from 'app/percona/shared/core';
import { Kubernetes } from '../Kubernetes/Kubernetes.types';
import { DBCluster, DBClusterPayload, ManageDBClusters } from './DBCluster.types';
import { newDBClusterService } from './DBCluster.utils';
import { DBClusterService } from './DBCluster.service';

const RECHECK_INTERVAL = 10000;

export const useDBClusters = (kubernetes: Kubernetes[]): ManageDBClusters => {
  const [dbClusters, setDBClusters] = useState<DBCluster[]>([]);
  const [loading, setLoading] = useState(true);
  let timer: NodeJS.Timeout;

  const getDBClusters = async (triggerLoading = true) => {
    if (triggerLoading) {
      setLoading(true);
    }

    try {
      const requests = kubernetes.map(DBClusterService.getDBClusters);
      const results = await processPromiseResults(requests);

      const clustersList: DBCluster[] = results.reduce((acc: DBCluster[], r, index) => {
        if (r.status !== 'fulfilled') {
          return acc;
        }

        const pxcClusters: DBClusterPayload[] = r.value?.pxc_clusters ?? [];
        const psmdbClusters: DBClusterPayload[] = r.value?.psmdb_clusters ?? [];
        const pxcClustersModel = clustersToModel(Databases.mysql, pxcClusters, kubernetes, index);
        const psmdbClustersModel = clustersToModel(Databases.mongodb, psmdbClusters, kubernetes, index);

        return acc.concat([...pxcClustersModel, ...psmdbClustersModel]);
      }, []);

      setDBClusters(clustersList);
    } catch (e) {
      logger.error(e);
    } finally {
      if (triggerLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (kubernetes && kubernetes.length > 0) {
      getDBClusters();

      timer = setInterval(() => getDBClusters(false), RECHECK_INTERVAL);
    }

    return () => clearTimeout(timer);
  }, [kubernetes]);

  return [dbClusters, getDBClusters, setLoading, loading];
};

const clustersToModel = (database: Databases, clusters: DBClusterPayload[], kubernetes: Kubernetes[], index: number) =>
  clusters.map((cluster) => {
    return newDBClusterService(database).toModel(cluster, kubernetes[index].kubernetesClusterName, database);
  });

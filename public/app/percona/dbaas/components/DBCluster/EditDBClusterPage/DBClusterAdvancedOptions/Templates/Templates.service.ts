import { apiManagement } from 'app/percona/shared/helpers/api';

import { DBClusterType } from '../../../DBCluster.types';

import { DBClusterTemplatesRequest, DBClusterTemplatesResponse } from './Templates.types';

export const TemplatesService = {
  getDBaaSTemplates(kubernetesClusterName: string, k8sClusterType: DBClusterType): Promise<DBClusterTemplatesResponse> {
    return apiManagement.post<DBClusterTemplatesResponse, DBClusterTemplatesRequest>(
      '/DBaaS/Templates/List',
      { kubernetes_cluster_name: kubernetesClusterName, cluster_type: k8sClusterType },
      true
    );
  },
};

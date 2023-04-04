import { Databases } from '../../../../../../shared/core';
import { DBClusterType } from '../../../DBCluster.types';

export interface TemplatesProps {
  k8sClusterName: string;
  databaseType: Databases;
}

export interface DBClusterTemplate {
  name: string;
  kind: string;
}
export interface DBClusterTemplatesResponse {
  templates: DBClusterTemplate[];
}

export interface DBClusterTemplatesRequest {
  kubernetes_cluster_name: string;
  cluster_type: DBClusterType;
}

export interface DBClusterTemplate {
  name: string;
  kind: string;
}

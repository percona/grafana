import { DBCluster } from '../../../../dbaas/components/DBCluster/DBCluster.types';

export interface PerconaDBClustersState {
  result: Array<Partial<DBCluster>>;
  loading: boolean | undefined;
  credentialsLoading: boolean | undefined;
}

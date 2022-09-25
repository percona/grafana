import {DBCluster} from "../../../../dbaas/components/DBCluster/DBCluster.types";

export interface PerconaDBClustersState {
  result: DBCluster[];
  loading: boolean | undefined;
  credentialsLoading: boolean | undefined;
}

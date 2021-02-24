import { DBCluster } from '../DBCluster.types';

export interface DBClusterStatusProps {
  dbCluster: DBCluster;
  setSelectedCluster: (dbCluster: DBCluster) => void;
  setLogsModalVisible: (isVisible: boolean) => void;
}

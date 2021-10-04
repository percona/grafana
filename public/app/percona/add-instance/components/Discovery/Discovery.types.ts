import { InstanceAvailableType } from '../../panel.types';
export interface DiscoverySearchPanelProps {
  selectInstance: React.Dispatch<React.SetStateAction<InstanceAvailableType>>;
}

export interface Instance {
  region: string;
  az: string;
  instance_id: string;
  node_model: string;
  address: string;
  port: number;
  engine: string;
  engine_version: string;
}
export interface RDSInstances {
  rds_instances: Instance;
}

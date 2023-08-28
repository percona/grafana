import { Databases } from 'app/percona/shared/core';

import { FlattenService } from '../../Inventory.types';

export interface ClustersProps {
  services: FlattenService[];
  onDelete: (service: FlattenService) => void;
}

export interface ClusterItemProps {
  cluster: ServicesCluster;
  onDelete: (service: FlattenService) => void;
}

export interface ServicesCluster {
  name: string;
  type?: Databases;
  services: FlattenService[];
}

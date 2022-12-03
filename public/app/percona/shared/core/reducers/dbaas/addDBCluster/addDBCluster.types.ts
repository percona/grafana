import { DatabaseVersion } from '../../../../../dbaas/components/DBCluster/DBCluster.types';
import {
  DatabaseOption,
  KubernetesOption,
} from '../../../../../dbaas/components/DBCluster/EditDBClusterPage/DBClusterBasicOptions/DBClusterBasicOptions.types';
import {
  AddDBClusterFields,
  AddDBClusterFormValues,
} from '../../../../../dbaas/components/DBCluster/EditDBClusterPage/EditDBClusterPage.types';

export interface PerconaAddDBClusterState {
  result?: 'ok' | 'error';
  loading?: boolean;
}

export interface AddDBClusterValues extends AddDBClusterFormValues {
  [AddDBClusterFields.name]: string;
  [AddDBClusterFields.kubernetesCluster]: KubernetesOption;
  [AddDBClusterFields.databaseType]: DatabaseOption;
  [AddDBClusterFields.databaseVersion]: DatabaseVersion;
  [AddDBClusterFields.expose]: boolean;
  //TODO проверить что эти типы используются в submit в компоненте
}

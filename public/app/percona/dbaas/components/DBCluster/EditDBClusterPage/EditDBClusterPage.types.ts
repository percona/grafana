/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectableValue } from '@grafana/data/src';

import { ScheduledSectionFieldsValuesProps } from '../../../../backup/components/AddBackupPage/ScheduleSection/ScheduleSectionFields/ScheduleSectionFields.types';
import { Kubernetes } from '../../Kubernetes/Kubernetes.types';

import { ConfigurationFields } from './DBClusterAdvancedOptions/Configurations/Configurations.types';
import { AdvancedOptionsFields, DBClusterResources } from './DBClusterAdvancedOptions/DBClusterAdvancedOptions.types';
import { NetworkAndSecurityFields } from './DBClusterAdvancedOptions/NetworkAndSecurity/NetworkAndSecurity.types';
import {
  BasicOptionsFields,
  DatabaseOptionInitial,
  KubernetesOption,
} from './DBClusterBasicOptions/DBClusterBasicOptions.types';
import { DBaaSBackupProps } from './DBaaSBackups/DBaaSBackups.types';
export type DBClusterPageMode = 'create' | 'edit' | 'list';

export interface EditDBClusterPageProps {
  kubernetes: Kubernetes[];
}

export interface DBClusterFormValues {
  [AdvancedOptionsFields.nodes]: number;
  [AdvancedOptionsFields.memory]: number;
  [AdvancedOptionsFields.cpu]: number;
  [AdvancedOptionsFields.disk]: number;
  [ConfigurationFields.configuration]?: string;
  [ConfigurationFields.storageClass]?: SelectableValue<string>;
  [NetworkAndSecurityFields.expose]?: boolean;
  [NetworkAndSecurityFields.sourceRanges]?: Array<{}> | [];
  [NetworkAndSecurityFields.internetFacing]?: boolean;
}
export interface AddDBClusterFormValues
  extends ScheduledSectionFieldsValuesProps,
    DBClusterFormValues,
    DBaaSBackupProps {
  [BasicOptionsFields.kubernetesCluster]?: KubernetesOption;
  [BasicOptionsFields.name]?: string;
  [BasicOptionsFields.databaseType]?: DatabaseOptionInitial;
  [BasicOptionsFields.databaseVersion]?: string;
  [BasicOptionsFields.restoreFrom]?: SelectableValue<string>;

  [BasicOptionsFields.backupArtifact]?: SelectableValue<string>;
  [AdvancedOptionsFields.resources]: DBClusterResources;
}

export interface UpdateDBClusterFormValues extends DBClusterFormValues {
  [BasicOptionsFields.databaseType]: SelectableValue;
  [AdvancedOptionsFields.resources]?: DBClusterResources;
}

export interface DBClusterFormSubmitProps {
  mode: DBClusterPageMode;
  showPMMAddressWarning: boolean;
}

export type ClusterSubmit = (values: Record<string, any>) => Promise<void>;

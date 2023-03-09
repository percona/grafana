/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectableValue } from '@grafana/data/src';

import { ScheduleSectionFields } from '../../../../backup/components/AddBackupPage/ScheduleSection/ScheduleSectionFields/ScheduleSectionFields.types';
import { Settings } from '../../../../settings/Settings.types';
import { PeriodType } from '../../../../shared/helpers/cron/types';
import { Kubernetes } from '../../Kubernetes/Kubernetes.types';

import { ConfigurationFields } from './DBClusterAdvancedOptions/Configurations/Configurations.types';
import { AdvancedOptionsFields, DBClusterResources } from './DBClusterAdvancedOptions/DBClusterAdvancedOptions.types';
import { NetworkAndSecurityFields } from './DBClusterAdvancedOptions/NetworkAndSecurity/NetworkAndSecurity.types';
import {
  BasicOptionsFields,
  DatabaseOptionInitial,
  KubernetesOption,
} from './DBClusterBasicOptions/DBClusterBasicOptions.types';
import { RestoreFields } from './DBClusterBasicOptions/Restore/Restore.types';
import { DBaaSBackupFields } from './DBaaSBackups/DBaaSBackups.types';
export type DBClusterPageMode = 'create' | 'edit' | 'list';

export interface EditDBClusterPageProps {
  kubernetes: Kubernetes[];
}

export interface DBClusterCommonFormValues {
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
export interface AddDBClusterFormValues {
  [BasicOptionsFields.name]?: string;
  [BasicOptionsFields.kubernetesCluster]?: KubernetesOption;
  [BasicOptionsFields.databaseType]?: DatabaseOptionInitial;
  [BasicOptionsFields.databaseVersion]?: string;
  [DBaaSBackupFields.location]?: SelectableValue<string>;
  [DBaaSBackupFields.retention]?: number;
  [AdvancedOptionsFields.nodes]: number;
  [AdvancedOptionsFields.memory]: number;
  [AdvancedOptionsFields.cpu]: number;
  [AdvancedOptionsFields.disk]: number;
  [ConfigurationFields.configuration]?: string;
  [ConfigurationFields.storageClass]?: SelectableValue<string>;
  [NetworkAndSecurityFields.expose]?: boolean;
  [NetworkAndSecurityFields.sourceRanges]?: Array<{}> | [];
  [NetworkAndSecurityFields.internetFacing]?: boolean;
  [ScheduleSectionFields.period]?: SelectableValue<PeriodType>;
  [ScheduleSectionFields.month]?: Array<SelectableValue<number>>;
  [ScheduleSectionFields.day]?: Array<SelectableValue<number>>;
  [ScheduleSectionFields.weekDay]?: Array<SelectableValue<number>>;
  [ScheduleSectionFields.startHour]?: Array<SelectableValue<number>>;
  [ScheduleSectionFields.startMinute]?: Array<SelectableValue<number>>;
  [AdvancedOptionsFields.resources]: DBClusterResources;
  [RestoreFields.restoreFrom]?: SelectableValue<string>;

  [RestoreFields.backupArtifact]?: SelectableValue<string>;
  [RestoreFields.secretsName]?: SelectableValue<string>;
}

export interface UpdateDBClusterFormValues extends DBClusterCommonFormValues {
  [BasicOptionsFields.databaseType]: SelectableValue;
  [AdvancedOptionsFields.resources]?: DBClusterResources;
}

export interface DBClusterFormSubmitProps {
  mode: DBClusterPageMode;
  showPMMAddressWarning: boolean;
  settings?: Settings;
}

export type ClusterSubmit = (values: Record<string, any>) => Promise<void>;

// export interface EditDBClusterForm {
//   [AdvancedOptionsFields.nodes]: number;
//   [AdvancedOptionsFields.memory]: number;
//   [AdvancedOptionsFields.cpu]: number;
//   [AdvancedOptionsFields.disk]: number;
//   [ConfigurationFields.configuration]?: string;
//   [ConfigurationFields.storageClass]?: SelectableValue<string>;
//   [NetworkAndSecurityFields.expose]?: boolean;
//   [NetworkAndSecurityFields.sourceRanges]?: Array<{}> | [];
//   [NetworkAndSecurityFields.internetFacing]?: boolean;
//

export type EditDBClusterForm = AddDBClusterFormValues & UpdateDBClusterFormValues;

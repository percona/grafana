import { Databases } from '../../percona/shared/core';
import { AzureCredentials } from './components/AzureDiscovery/components/Instances/Instances.types';
import { RDSCredentials } from './components/Discovery/components/Instances/Instances.types';

// TODO: refactor this type to have separated interfaces for Azure and RDS types of instances
export interface RemoteInstanceCredentials {
  serviceName?: string;
  username?: string;
  port?: string;
  address?: string;
  isRDS?: boolean;
  isAzure?: boolean;
  region?: string;
  aws_access_key?: string;
  aws_secret_key?: string;
  azure_client_id?: string;
  azure_client_secret?: string;
  azure_tenant_id?: string;
  azure_subscription_id?: string;
  azure_resource_group?: string;
  azure_database_exporter?: boolean;
  instance_id?: string;
  az?: string;
}

export enum InstanceTypesExtra {
  rds = 'rds',
  azure = 'azure',
  external = 'external',
}

export type InstanceTypes = Databases | InstanceTypesExtra;

export type AvailableTypes = Exclude<InstanceTypes, Databases.mariadb>;

export const INSTANCE_TYPES_LABELS = {
  [Databases.mysql]: 'MySQL',
  [Databases.mariadb]: 'MariaDB',
  [Databases.mongodb]: 'MongoDB',
  [Databases.postgresql]: 'PostgreSQL',
  [Databases.proxysql]: 'ProxySQL',
  [Databases.haproxy]: 'HAProxy',
  [InstanceTypesExtra.azure]: '',
  [InstanceTypesExtra.rds]: '',
  [InstanceTypesExtra.external]: '',
};

export type InstanceAvailableType = AvailableTypes | '';

export interface InstanceAvailable {
  type: InstanceAvailableType;
  credentials?: AzureCredentials | RDSCredentials | RemoteInstanceCredentials;
}

export interface Instance {
  type: InstanceTypes | '';
  credentials?: AzureCredentials | RDSCredentials | RemoteInstanceCredentials;
}

export type SelectInstance = React.Dispatch<React.SetStateAction<InstanceAvailable>>;

import { ServiceAgent, ServiceAgentStatus } from 'app/percona/inventory/Inventory.types';

import { Databases } from '../../core';

export enum ServiceType {
  invalid = 'SERVICE_TYPE_INVALID',
  mysql = 'MYSQL_SERVICE',
  mongodb = 'MONGODB_SERVICE',
  posgresql = 'POSTGRESQL_SERVICE',
  proxysql = 'PROXYSQL_SERVICE',
  haproxy = 'HAPROXY_SERVICE',
  external = 'EXTERNAL_SERVICE',
}

export interface ListServicesBody {
  node_id: string;
  service_type: ServiceType;
  external_group: string;
}

export interface DbServicePayload {
  service_id: string;
  service_name: string;
  node_id: string;
  node_name: string;
  enviroment?: string;
  cluster?: string;
  replication_set?: string;
  custom_labels?: Record<string, string>;
  agents?: Array<{ agent_id: string; status: ServiceAgentStatus }>;
}

export interface DbServiceWithAddressPayload extends DbServicePayload {
  address: string;
  port: string;
  socket: string;
}

export interface PostgreSQLServicePayload extends DbServiceWithAddressPayload {
  database_name: string;
}

export interface ExternalServicePayload extends DbServicePayload {
  group: string;
}

export interface ServiceListPayload {
  [Databases.haproxy]?: DbServicePayload[];
  [Databases.mariadb]?: DbServiceWithAddressPayload[];
  [Databases.mongodb]?: DbServiceWithAddressPayload[];
  [Databases.mysql]?: DbServiceWithAddressPayload[];
  [Databases.postgresql]?: PostgreSQLServicePayload[];
  [Databases.proxysql]?: DbServiceWithAddressPayload[];
  external?: ExternalServicePayload[];
}

export type Service = {
  type: Databases | 'external';
  params: DbService & DbServiceWithAddress & PostgreSQLService & ExternalService;
};

export interface DbService {
  serviceId: string;
  serviceName: string;
  nodeId: string;
  nodeName: string;
  environment?: string;
  cluster?: string;
  replicationSet?: string;
  customLabels?: Record<string, string>;
  agents?: Array<Pick<ServiceAgent, 'agentId' | 'status'>>;
}

export interface DbServiceWithAddress extends DbService {
  address: string;
  port: string;
  socket: string;
}

export interface PostgreSQLService extends DbServiceWithAddress {
  databaseName: string;
}

export interface ExternalService extends DbService {
  group: string;
}

export interface RemoveServiceBody {
  service_id: string;
  force: boolean;
}

export interface ListTypesPayload {
  service_types?: ServiceType[];
}

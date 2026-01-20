import { MetricsResolutions } from '../settings/Settings.types';
import { Databases } from '../shared/core';
import { DbNode, NodeType } from '../shared/services/nodes/Nodes.types';
import {
  DbAgent,
  DbService,
  DbServiceWithAddress,
  ServiceStatus,
  ServiceType,
} from '../shared/services/services/Services.types';

export interface CompatibleServicePayload {
  service_id: string;
  service_name: string;
  cluster?: string;
}

export type CompatibleServiceListPayload = { [key in Databases]?: CompatibleServicePayload[] };

export interface Service {
  id: string;
  name: string;
  cluster?: string;
}

export type DBServiceList = { [key in Databases]?: Service[] };

export enum AgentType {
  pmmAgent = 'pmm-agent',
  nodeExporter = 'node_exporter',
  mysqldExporter = 'mysqld_exporter',
  mongodbExporter = 'mongodb_exporter',
  postgresExporter = 'postgres_exporter',
  proxysqlExporter = 'proxysql_exporter',
  rdsExporter = 'rds_exporter',
  azureDatabaseExporter = 'azure_database_exporter',
  qanMysql_perfschema_agent = 'qan-mysql-perfschema-agent',
  qanMysql_slowlog_agent = 'qan-mysql-slowlog-agent',
  qanMongodb_profiler_agent = 'qan-mongodb-profiler-agent',
  qanMongodb_mongolog_agent = 'qan-mongodb-mongolog-agent',
  qanPostgresql_pgstatements_agent = 'qan-postgresql-pgstatements-agent',
  qanPostgresql_pgstatmonitor_agent = 'qan-postgresql-pgstatmonitor-agent',
  externalExporter = 'external-exporter',
  vmAgent = 'vmagent',
  nomadAgent = 'nomad-agent',
  valkeyExporter = 'valkey_exporter',
  rtaMongoDBAgent = 'rta-mongodb-agent',
}

export enum ServiceAgentStatus {
  STARTING = 'AGENT_STATUS_STARTING',
  RUNNING = 'AGENT_STATUS_RUNNING',
  WAITING = 'AGENT_STATUS_WAITING',
  STOPPING = 'AGENT_STATUS_STOPPING',
  DONE = 'AGENT_STATUS_DONE',
  UNKNOWN = 'AGENT_STATUS_UNKNOWN',
}

export enum MonitoringStatus {
  OK = 'OK',
  FAILED = 'Failed',
  WARNING = 'Warning',
}

export interface ServiceAgentPayload {
  agent_id: string;
  agent_type: AgentType;
  status?: ServiceAgentStatus;
  is_connected?: boolean;
  custom_labels?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type ServiceAgentListPayload = {
  agents: ServiceAgentPayload[];
};

export type ServiceAgent = {
  agentId: string;
  status?: ServiceAgentStatus;
  customLabels?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface Agent {
  type: AgentType;
  params: ServiceAgent;
}

export interface RemoveAgentBody {
  id: string;
}
export interface RemoveNodeBody {
  node_id: string;
  force: boolean;
}

interface DbAgentNode {
  agent_id: string;
  agent_type: AgentType;
  status: ServiceAgentStatus;
  is_connected?: boolean;
}

interface ServiceNodeListDB {
  service_id: string;
  service_type: ServiceType;
  service_name: string;
}

interface ServiceNodeList {
  serviceId: string;
  serviceType: ServiceType;
  serviceName: string;
}

export interface Node {
  nodeId: string;
  nodeType: string;
  nodeName: string;
  machineId?: string;
  distro?: string;
  address: string;
  nodeModel?: string;
  region?: string;
  az?: string;
  containerId?: string;
  containerName?: string;
  customLabels?: Record<string, string>;
  agents?: DbAgent[];
  createdAt: string;
  updatedAt: string;
  status: ServiceStatus;
  services?: ServiceNodeList[];
  properties?: Record<string, string>;
  agentsStatus?: string;
  isPmmServerNode: boolean;
}

export interface NodeDB {
  node_id: string;
  node_type: string;
  node_name: string;
  machine_id?: string;
  distro?: string;
  address: string;
  node_model?: string;
  region?: string;
  az?: string;
  container_id?: string;
  container_name?: string;
  custom_labels?: Record<string, string>;
  agents?: DbAgentNode[];
  created_at: string;
  updated_at: string;
  status: ServiceStatus;
  services?: ServiceNodeListDB[];
  is_pmm_server_node: boolean;
}

export interface NodeListDBPayload {
  nodes: NodeDB[];
}
export type FlattenAgent = ServiceAgent & {
  type: AgentType;
};

export type FlattenService = DbService &
  Partial<DbServiceWithAddress> & {
    type: Databases | 'external';
    agentsStatus: string;
  };

export type FlattenNode = DbNode & {
  type: NodeType;
};

export interface NodesOption {
  value: string;
  label: string;
  agents?: AgentsOption[];
  isPMMServerNode?: boolean;
}

export interface AgentsOption {
  value: string;
  label: string;
}

export interface UpdateAgentItem {
  enable?: boolean;
  custom_labels?: Record<string, string>;
  enable_push_metrics?: boolean;
  metrics_resolutions?: MetricsResolutions;
}

export interface UpdateAgentBody {
  node_exporter?: UpdateAgentItem;
  mysqld_exporter?: UpdateAgentItem;
  mongodb_exporter?: UpdateAgentItem;
  postgres_exporter?: UpdateAgentItem;
  proxysql_exporter?: UpdateAgentItem;
  external_exporter?: UpdateAgentItem;
  rds_exporter?: UpdateAgentItem;
  azure_database_exporter?: UpdateAgentItem;
  qan_mysql_perfschema_agent?: UpdateAgentItem;
  qan_mysql_slowlog_agent?: UpdateAgentItem;
  qan_mongodb_profiler_agent?: UpdateAgentItem;
  qan_mongodb_mongolog_agent?: UpdateAgentItem;
  qan_postgresql_pgstatements_agent?: UpdateAgentItem;
  qan_postgresql_pgstatmonitor_agent?: UpdateAgentItem;
  nomad_agent?: {
    enable?: boolean;
  };
}

export enum MetricsMode {
  UNSPECIFIED = 0,
  PULL = 1,
  PUSH = 2,
}

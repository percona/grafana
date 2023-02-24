import { Databases } from '../shared/core';

export interface ServicePayload {
  service_id: string;
  service_name: string;
}

export type ServiceListPayload = { [key in Databases]?: ServicePayload[] };

export interface Service {
  id: string;
  name: string;
}

export type DBServiceList = { [key in Databases]?: Service[] };

export enum AgentType {
  amazonRdsMysql = 'amazon_rds_mysql',
  container = 'container',
  externalExporter = 'externalExporter',
  generic = 'generic',
  mongodb = 'mongodb',
  mongodbExporter = 'mongodbExporter',
  mysql = 'mysql',
  mysqldExporter = 'mysqldExporter',
  nodeExporter = 'nodeExporter',
  pmmAgent = 'pmm_agent',
  postgresExporter = 'postgresExporter',
  postgresql = 'postgresql',
  proxysql = 'proxysql',
  proxysqlExporter = 'proxysqlExporter',
  qanMongodb_profiler_agent = 'qan_mongodb_profiler_agent',
  qanMysql_perfschema_agent = 'qan_mysql_perfschema_agent',
  qanMysql_slowlog_agent = 'qan_mysql_slowlog_agent',
  qanPostgresql_pgstatements_agent = 'qan_postgresql_pgstatements_agent',
  qanPostgresql_pgstatmonitor_agent = 'qan_postgresql_pgstatmonitor_agent',
  rdsExporter = 'rdsExporter',
  remote = 'remote',
  remote_rds = 'remote_rds',
  vmAgent = 'vm_agent',
}

export type ServiceAgentPayload = {
  [key in AgentType]: Array<{
    agent_id: string;
    custom_labels?: Record<string, string>;
    // We don't need to care about all the other fields for now
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
};

export interface ServiceAgent {
  agentId: string;
  customLabels?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Agent {
  type: AgentType;
  params: ServiceAgent;
}

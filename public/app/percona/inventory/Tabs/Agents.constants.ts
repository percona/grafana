import { SelectableValue } from '@grafana/data';

import { AgentType } from '../Inventory.types';

export const AGENTS_MAIN_COLUMNS = [
  'node_id',
  'agent_id',
  'node_name',
  'address',
  'custom_labels',
  'type',
  'status',
  'is_connected',
  'disabled',
];

export const AGENT_LABELS_SKIP_KEYS: string[] = [
  'azure_options',
  'mongo_db_options',
  'mysql_options',
  'postgresql_options',
  'valkey_options',
];

export const AGENT_TYPE_NAME: Record<AgentType, string> = {
  [AgentType.pmmAgent]: 'PMM agent',
  [AgentType.nodeExporter]: 'Node exporter',
  [AgentType.mysqldExporter]: 'MySQL exporter',
  [AgentType.mongodbExporter]: 'MongoDB exporter',
  [AgentType.postgresExporter]: 'PostgreSQL exporter',
  [AgentType.proxysqlExporter]: 'ProxySQL exporter',
  [AgentType.rdsExporter]: 'RDS exporter',
  [AgentType.azureDatabaseExporter]: 'Azure database exporter',
  [AgentType.qanMysql_perfschema_agent]: 'QAN MySQL Performance Schema agent',
  [AgentType.qanMysql_slowlog_agent]: 'QAN MySQL Slow Query Log agent',
  [AgentType.qanMongodb_profiler_agent]: 'QAN MongoDB Profiler agent',
  [AgentType.qanMongodb_mongolog_agent]: 'QAN MongoDB Mongo Log agent',
  [AgentType.qanPostgresql_pgstatements_agent]: 'QAN PostgreSQL pg_stat_statements agent',
  [AgentType.qanPostgresql_pgstatmonitor_agent]: 'QAN PostgreSQL pg_stat_monitor agent',
  [AgentType.externalExporter]: 'External exporter',
  [AgentType.vmAgent]: 'VictoriaMetrics agent',
  [AgentType.nomadAgent]: 'Nomad agent',
  [AgentType.valkeyExporter]: 'Valkey exporter',
  [AgentType.rtaMongoDBAgent]: 'Real-Time Analytics MongoDB agent',
  [AgentType.remote]: 'Remote agent',
  [AgentType.remote_rds]: 'Remote RDS agent',
};

export const AGENT_TYPE_OPTIONS = Object.entries(AGENT_TYPE_NAME)
  .map<SelectableValue<AgentType>>(([type, name]) => ({
    value: type as AgentType,
    label: name,
  }))
  .sort((a, b) => a.label!.localeCompare(b.label!));

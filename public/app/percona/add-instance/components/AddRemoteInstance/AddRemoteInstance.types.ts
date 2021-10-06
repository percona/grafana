import { RemoteInstanceCredentials } from 'app/percona/add-instance/panel.types';

export enum TrackingOptions {
  none = 'none',
  pgStatements = 'qan_postgresql_pgstatements_agent',
  pgMonitor = 'qan_postgresql_pgstatmonitor_agent',
}

export interface InstanceData {
  instanceType?: string;
  defaultPort?: number;
  remoteInstanceCredentials: RemoteInstanceCredentials;
  discoverName?: string;
}

interface Instance {
  type: any;
  credentials?: any;
}

export interface AddRemoteInstanceProps {
  instance: Instance;
  selectInstance: (intance: any) => void;
}

export interface AddNode {
  node_name: string;
  node_type: string;
}

export enum DefaultPorts {
  small = 'small',
  medium = 'medium',
  large = 'large',
  custom = 'custom',
}

export interface RemoteInstanceExternalServicePayload {
  custom_labels: {};
  service_name: string;
  address?: string;
  add_node: AddNode;
  listen_port: string;
  metrics_mode: number;
}

export interface RemoteInstancePayload {
  custom_labels: {};
  service_name: string;
  address?: string;
  listen_port: string;
  metrics_mode: number;
  node_name?: string;
  qan?: string;
}

export interface ErrorResponse {
  error: string;
  code: number;
  message: string;
  details: [
    {
      type_url: string;
      value: string;
    }
  ];
}

interface Service {
  service_id: string;
  service_name: string;
  node_id: string;
  socket: string;
  environment: string;
  cluster: string;
  replication_set: string;
  custom_labels: {
    // additionalProp1: string,
    // additionalProp2: string,
    // additionalProp3: string,
  };
}

interface ExtendedService extends Service {
  address: string;
  port: number;
}
interface BaseExporter {
  agent_id: string;
  pmm_agent_id: string;
  disabled: boolean;
  service_id: string;
  username: string;
  tls: boolean;
  tls_skip_verify: boolean;
  custom_labels: {};
  status: string; //TODO enum
}

interface Node {
  node_id: string;
  node_name: string;
  address: string;
  node_model: string;
  region: string;
  az: string;
  custom_labels: {};
}

interface MySQLExporter extends BaseExporter {
  tls_ca: string;
  tls_cert: string;
  tls_key: string;
  tablestats_group_table_limit: number;
  push_metrics_enabled: boolean;
  tablestats_group_disabled: boolean;
  disabled_collectors: string[];
  listen_port: number;
}

interface MySQLPerfschema extends BaseExporter {
  tls_ca: string;
  tls_cert: string;
  tls_key: string;
  query_examples_disabled: boolean;
}

interface MySQLShowLog extends MySQLPerfschema {
  max_slowlog_file_size: string;
}

interface PostgreSQLExporter extends BaseExporter {
  push_metrics_enabled: boolean;
  disabled_collectors: string[];
  listen_port: number;
}

interface PgStatMonitorAgent extends BaseExporter {
  query_examples_disabled: boolean;
}

interface ProxySQLExporter extends BaseExporter {
  push_metrics_enabled: boolean;
  disabled_collectors: string[];
  listen_port: number;
}

interface MongoDbExporter extends BaseExporter {
  push_metrics_enabled: boolean;
  disabled_collectors: string[];
  listen_port: number;
}

export interface MySQLInstanceResponse {
  service: ExtendedService;
  mysqld_exporter: MySQLExporter;
  qan_mysql_perfschema: MySQLPerfschema;
  qan_mysql_slowlog: MySQLShowLog;
  table_count: number;
}

export interface PostgreSQLInstanceResponse {
  service: ExtendedService;
  postgres_exporter: PostgreSQLExporter;
  qan_postgresql_pgstatements_agent: BaseExporter;
  qan_postgresql_pgstatmonitor_agent: PgStatMonitorAgent;
}

export interface ProxySQLInstanceResponse {
  service: ExtendedService;
  proxysql_exxporter: ProxySQLExporter;
}

export interface AddHaProxyResponse {
  service: Service;
  external_exporter: {
    agent_id: string;
    runs_on_node_id: string;
    disabled: true;
    service_id: string;
    username: string;
    scheme: string;
    metrics_path: string;
    custom_labels: {};
    listen_port: number;
    push_metrics_enabled: true;
  };
}

export interface AddMongoDbReponse {
  service: ExtendedService;
  mongodb_exporter: MongoDbExporter;
  qan_mongodb_profiler: BaseExporter;
}

export interface AddRDSResponse {
  node: Node;
  rds_exporter: {
    agent_id: string;
    pmm_agent_id: string;
    disabled: boolean;
    node_id: string;
    aws_access_key: string;
    custom_labels: {};
    status: string;
    listen_port: number;
    basic_metrics_disabled: boolean;
    enhanced_metrics_disabled: boolean;
    push_metrics_enabled: boolean;
  };
  mysql: {
    service_id: string;
    service_name: string;
    node_id: string;
    address: string;
    port: number;
    socket: string;
    environment: string;
    cluster: string;
    replication_set: string;
    custom_labels: {};
  };
  mysqld_exporter: MySQLExporter;
  qan_mysql_perfschema: MySQLPerfschema;
  table_count: number;
  postgresql: {
    service_id: string;
    service_name: string;
    node_id: string;
    address: string;
    port: number;
    socket: string;
    environment: string;
    cluster: string;
    replication_set: string;
    custom_labels: {};
  };
  postgresql_exporter: PostgreSQLExporter;
  qan_postgresql_pgstatements: BaseExporter;
}

export interface AddExternalResponse {
  service: {
    service_id: string;
    service_name: string;
    node_id: string;
    environment: string;
    cluster: string;
    replication_set: string;
    custom_labels: {};
    group: string;
  };
  external_exporter: {
    agent_id: string;
    runs_on_node_id: string;
    disabled: boolean;
    service_id: string;
    username: string;
    scheme: string;
    metrics_path: string;
    custom_labels: {};
    listen_port: number;
    push_metrics_enabled: boolean;
  };
}

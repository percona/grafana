import { CancelToken } from 'axios';

import { Databases } from 'app/percona/shared/core';
import { apiManagement } from 'app/percona/shared/helpers/api';

import { InstanceTypesExtra, InstanceAvailableType } from '../../panel.types';

import {
  ExternalPayload,
  RemoteInstancePayload,
  TrackingOptions,
  ProxySQLInstanceResponse,
  PostgreSQLInstanceResponse,
  MySQLInstanceResponse,
  AddHaProxyResponse,
  AddMongoDbResponse,
  AddRDSResponse,
  AddExternalResponse,
  ErrorResponse,
  RDSPayload,
  MSAzurePayload,
  MySQLPayload,
  PostgreSQLPayload,
  HaProxyPayload,
  ProxySQLPayload,
  MongoDBPayload,
  AddServicePayload,
} from './AddRemoteInstance.types';

const BASE_URL = '/services';

class AddRemoteInstanceService {
  /*
* {
  "node_id": "string",
  "node_name": "string",
  "add_node": {
    "node_type": "NODE_TYPE_INVALID",
    "node_name": "string",
    "machine_id": "string",
    "distro": "string",
    "container_id": "string",
    "container_name": "string",
    "node_model": "string",
    "region": "string",
    "az": "string",
    "custom_labels": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  },
  "service_name": "string",
  "address": "string",
  "port": 0,
  "socket": "string",
  "pmm_agent_id": "string",
  "environment": "string",
  "cluster": "string",
  "replication_set": "string",
  "username": "string",
  "password": "string",
  "qan_mysql_perfschema": true,
  "qan_mysql_slowlog": true,
  "custom_labels": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "skip_connection_check": true,
  "disable_comments_parsing": true,
  "max_query_length": 0,
  "disable_query_examples": true,
  "max_slowlog_file_size": "string",
  "tls": true,
  "tls_skip_verify": true,
  "tls_ca": "string",
  "tls_cert": "string",
  "tls_key": "string",
  "tablestats_group_table_limit": 0,
  "metrics_mode": "AUTO",
  "disable_collectors": [
    "string"
  ],
  "agent_password": "string",
  "log_level": "auto",
  "expose_exporter": true
}
*
* */
  static async addMysql(body: MySQLPayload, token?: CancelToken) {
    return apiManagement.post<MySQLInstanceResponse | ErrorResponse, AddServicePayload>(
      BASE_URL,
      { mysql: body },
      false,
      token
    );
  }

  static async addPostgresql(body: PostgreSQLPayload, token?: CancelToken) {
    return apiManagement.post<PostgreSQLInstanceResponse | ErrorResponse, AddServicePayload>(
      BASE_URL,
      { postgresql: body },
      false,
      token
    );
  }

  static async addProxysql(body: ProxySQLPayload, token?: CancelToken) {
    return apiManagement.post<ProxySQLInstanceResponse | ErrorResponse, AddServicePayload>(
      BASE_URL,
      { proxysql: body },
      false,
      token
    );
  }

  static async addHaproxy(body: HaProxyPayload, token?: CancelToken) {
    return apiManagement.post<AddHaProxyResponse | ErrorResponse, AddServicePayload>(
      BASE_URL,
      { haproxy: body },
      false,
      token
    );
  }

  static async addMongodb(body: MongoDBPayload, token?: CancelToken) {
    return apiManagement.post<AddMongoDbResponse | ErrorResponse, AddServicePayload>(
      BASE_URL,
      { mongodb: body },
      false,
      token
    );
  }

  static async addRDS(body: RDSPayload, token?: CancelToken) {
    return apiManagement.post<AddRDSResponse | ErrorResponse, AddServicePayload>(BASE_URL, { rds: body }, false, token);
  }

  static async addAzure(body: MSAzurePayload, token?: CancelToken) {
    return apiManagement.post<{} | ErrorResponse, RemoteInstancePayload>(`${BASE_URL}/azure`, body, false, token);
  }

  static async addExternal(body: ExternalPayload, token?: CancelToken) {
    return apiManagement.post<AddExternalResponse, AddServicePayload>(BASE_URL, { external: body }, false, token);
  }

  static addRemote(type: InstanceAvailableType, data: RemoteInstancePayload, token?: CancelToken) {
    switch (type) {
      case Databases.mongodb:
        return AddRemoteInstanceService.addMongodb(toPayload(data, '', type) as MongoDBPayload, token);
      case Databases.mysql:
        return AddRemoteInstanceService.addMysql(toPayload(data, '', type) as MySQLPayload, token);
      case Databases.postgresql:
        return AddRemoteInstanceService.addPostgresql(toPayload(data, '', type) as PostgreSQLPayload, token);
      case Databases.proxysql:
        return AddRemoteInstanceService.addProxysql(toPayload(data, '', type) as ProxySQLPayload, token);
      case Databases.haproxy:
        return AddRemoteInstanceService.addHaproxy(toExternalServicePayload(data), token);
      case InstanceTypesExtra.external:
        return AddRemoteInstanceService.addExternal(toExternalServicePayload(data), token);
      default:
        throw new Error('Unknown instance type');
    }
  }
}

export default AddRemoteInstanceService;

export const toPayload = (values: any, discoverName?: string, type?: InstanceAvailableType): RemoteInstancePayload => {
  const data = { ...values };

  if (values.custom_labels) {
    data.custom_labels = data.custom_labels
      .split(/[\n\s]/)
      .filter(Boolean)
      .reduce((acc: any, val: string) => {
        const [key, value] = val.split(':');

        acc[key] = value;

        return acc;
      }, {});
  }

  if (!values.isAzure) {
    if (data.isRDS && data.tracking === TrackingOptions.pgStatements) {
      data.qan_postgresql_pgstatements = true;
    } else if (!data.isRDS && data.tracking === TrackingOptions.pgStatements) {
      data.qan_postgresql_pgstatements_agent = true;
    } else if (!data.isRDS && data.tracking === TrackingOptions.pgMonitor) {
      data.qan_postgresql_pgstatmonitor_agent = true;
    }
  }

  data.service_name = data.serviceName;
  delete data.serviceName;

  if (!data.service_name) {
    data.service_name = data.address;
  }

  if (!values.isAzure && data.add_node === undefined) {
    data.add_node = {
      node_name: data.service_name,
      node_type: 'NODE_TYPE_REMOTE_NODE',
    };
  }

  if (values.isRDS && discoverName) {
    data.engine = discoverName;
  }

  if (values.isAzure && discoverName) {
    data.type = discoverName;
  }

  if (!data.pmm_agent_id) {
    // set default value for pmm agent id
    data.pmm_agent_id = 'pmm-server';
  }

  if (values.isRDS) {
    data.rds_exporter = true;
  }

  if (values.isAzure) {
    data.node_name = data.service_name;
    if (data.tracking === TrackingOptions.pgStatements || data.qan_mysql_perfschema) {
      data.qan = true;
    }
  }

  if (type === Databases.mongodb) {
    if (values.tls) {
      data.authentication_mechanism = 'MONGODB-X509';
    }
  }

  data.metrics_mode = 1;
  delete data.tracking;

  return data;
};

export const toExternalServicePayload = (values: any): ExternalPayload => {
  const data = { ...values };

  if (values.custom_labels) {
    data.custom_labels = data.custom_labels
      .split(/[\n\s]/)
      .filter(Boolean)
      .reduce((acc: any, val: string) => {
        const [key, value] = val.split(':');

        acc[key] = value;

        return acc;
      }, {});
  }

  delete data.tracking;
  data.service_name = data.serviceName;
  delete data.serviceName;

  if (!data.service_name) {
    data.service_name = data.address;
  }

  if (data.add_node === undefined) {
    data.add_node = {
      node_name: data.service_name,
      node_type: 'NODE_TYPE_REMOTE_NODE',
    };
  }

  data.listen_port = data.port;
  delete data.port;

  data.metrics_mode = 1;

  return data;
};

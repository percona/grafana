import { CancelToken } from 'axios';
import { apiManagement } from 'app/percona/shared/helpers/api';
import {
  RemoteInstanceExternalServicePayload,
  RemoteInstancePayload,
  TrackingOptions,
  ProxySQLInstanceResponse,
  PostgreSQLInstanceResponse,
  MySQLInstanceResponse,
  AddHaProxyResponse,
  AddMongoDbReponse,
  AddRDSResponse,
  AddExternalResponse,
  ErrorResponse,
} from './AddRemoteInstance.types';
import { InstanceTypesExtra, AvailableTypes } from '../../panel.types';
import { Databases } from '../../../../percona/shared/core';

class AddRemoteInstanceService {
  static async addMysql(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<MySQLInstanceResponse | ErrorResponse, RemoteInstancePayload>(
      '/MySQL/Add',
      body,
      false,
      token
    );
  }

  static async addPostgresql(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<PostgreSQLInstanceResponse | ErrorResponse, RemoteInstancePayload>(
      '/PostgreSQL/Add',
      body,
      false,
      token
    );
  }

  static async addProxysql(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<ProxySQLInstanceResponse | ErrorResponse, RemoteInstancePayload>(
      '/ProxySQL/Add',
      body,
      false,
      token
    );
  }

  static async addHaproxy(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<AddHaProxyResponse | ErrorResponse, RemoteInstancePayload>(
      '/HAProxy/Add',
      body,
      false,
      token
    );
  }

  static async addMongodb(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<AddMongoDbReponse | ErrorResponse, RemoteInstancePayload>(
      '/MongoDB/Add',
      body,
      false,
      token
    );
  }

  static async addRDS(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<AddRDSResponse | ErrorResponse, RemoteInstancePayload>('/RDS/Add', body, false, token);
  }

  static async addAzure(body: RemoteInstancePayload, token?: CancelToken) {
    return apiManagement.post<any, RemoteInstancePayload>('/azure/AzureDatabase/Add', body, false, token);
  }

  static async addExternal(body: RemoteInstanceExternalServicePayload, token?: CancelToken) {
    return apiManagement.post<AddExternalResponse, any>('/External/Add', body, false, token);
  }

  static addRemote(type: AvailableTypes | '', data: any, token?: CancelToken) {
    switch (type) {
      case Databases.mongodb:
        return AddRemoteInstanceService.addMongodb(toPayload(data, '', type), token);
      case Databases.mysql:
        return AddRemoteInstanceService.addMysql(toPayload(data, '', type), token);
      case Databases.postgresql:
        return AddRemoteInstanceService.addPostgresql(toPayload(data, '', type), token);
      case Databases.proxysql:
        return AddRemoteInstanceService.addProxysql(toPayload(data, '', type), token);
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

export const toPayload = (values: any, discoverName?: string, type?: AvailableTypes): RemoteInstancePayload => {
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
      node_type: 'REMOTE_NODE',
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

  if (type === Databases.mongodb && values.tls) {
    data.authentication_mechanism = 'MONGODB-X509';
  }

  data.metrics_mode = 1;
  delete data.tracking;

  return data;
};

export const toExternalServicePayload = (values: any): RemoteInstanceExternalServicePayload => {
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
      node_type: 'REMOTE_NODE',
    };
  }

  data.listen_port = data.port;
  delete data.port;

  data.metrics_mode = 1;

  return data;
};

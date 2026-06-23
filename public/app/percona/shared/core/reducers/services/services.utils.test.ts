import { ServiceAgentStatus } from 'app/percona/inventory/Inventory.types';
import { Service, ServiceListPayload, ServiceStatus } from 'app/percona/shared/services/services/Services.types';

import { Databases } from '../../types';

import { UpdateServiceParams } from './services.types';
import { didLabelsChange, toDbServicesModel, toUpdateServiceBody } from './services.utils';

const baseUpdateParams = (): UpdateServiceParams => ({
  serviceId: 'service_id',
  labels: {
    environment: 'prod',
    cluster: 'cluster-a',
    replication_set: 'repl-1',
  },
  custom_labels: { label: 'value' },
  current: {
    service_type: Databases.mysql,
    service_id: 'service_id',
    service_name: 'mysql',
    node_id: 'node_id',
    node_name: 'node',
    enviroment: 'prod',
    cluster: 'cluster-a',
    replication_set: 'repl-1',
    custom_labels: { label: 'value' },
  },
});

const withLabelChange = (
  property: 'environment' | 'cluster' | 'replication_set',
  value: string
): UpdateServiceParams => {
  const params = baseUpdateParams();
  params.labels[property] = value;
  return params;
};

describe('toDbServicesModel', () => {
  it('should correctly convert payload', () => {
    const payload: ServiceListPayload = {
      services: [
        {
          service_type: Databases.postgresql,
          service_id: 'p1',
          service_name: 'postgres one',
          node_id: 'node_1',
          node_name: 'node one',
          status: ServiceStatus.UP,
          database_name: 'db1',
          address: 'localhost',
          port: 80,
          socket: '',
          agents: [
            {
              agent_id: 'agent_1',
              status: ServiceAgentStatus.RUNNING,
            },
          ],
        },
        {
          service_type: Databases.postgresql,
          service_id: 'p2',
          service_name: 'postgres two',
          node_id: 'node_1',
          node_name: 'node one',
          status: ServiceStatus.UP,
          database_name: 'db2',
          address: 'localhost',
          port: 81,
          socket: '',
        },
        {
          service_type: Databases.mongodb,
          service_id: 'mongo1',
          service_name: 'mongo one',
          node_id: 'node_2',
          node_name: 'node two',
          status: 'STATUS_INVALID',
          address: 'localhost',
          port: 83,
          socket: '',
          custom_labels: {
            env: 'dev',
          },
        },
        {
          service_type: 'external',
          service_id: 'external1',
          service_name: 'external one',
          node_id: 'node_1',
          node_name: 'node one',
          group: 'g1',
          custom_labels: {
            env_name: 'dev',
          },
        },
      ],
    };

    expect(toDbServicesModel(payload)).toEqual<Service[]>([
      {
        type: Databases.postgresql,
        params: {
          serviceId: 'p1',
          serviceName: 'postgres one',
          nodeId: 'node_1',
          nodeName: 'node one',
          address: 'localhost',
          port: 80,
          status: ServiceStatus.UP,
          customLabels: {
            database_name: 'db1',
            socket: '',
          },
          agents: [
            {
              agentId: 'agent_1',
              status: ServiceAgentStatus.RUNNING,
            },
          ],
        },
      },
      {
        type: Databases.postgresql,
        params: {
          serviceId: 'p2',
          serviceName: 'postgres two',
          nodeId: 'node_1',
          nodeName: 'node one',
          status: ServiceStatus.UP,
          address: 'localhost',
          port: 81,
          customLabels: {
            database_name: 'db2',
            socket: '',
          },
        },
      },
      {
        type: Databases.mongodb,
        params: {
          serviceId: 'mongo1',
          serviceName: 'mongo one',
          nodeId: 'node_2',
          nodeName: 'node two',
          status: ServiceStatus.NA,
          address: 'localhost',
          port: 83,
          customLabels: {
            socket: '',
            env: 'dev',
          },
        },
      },
      {
        type: 'external',
        params: {
          serviceId: 'external1',
          serviceName: 'external one',
          nodeId: 'node_1',
          nodeName: 'node one',
          status: ServiceStatus.NA,
          customLabels: {
            group: 'g1',
            env_name: 'dev',
          },
        },
      },
    ]);
  });
});

describe('toUpdateServiceBody', () => {
  it('omits custom_labels when unchanged', () => {
    expect(toUpdateServiceBody(baseUpdateParams())).toEqual({
      service_id: 'service_id',
      environment: undefined,
      cluster: undefined,
      replication_set: undefined,
      custom_labels: undefined,
    });
  });

  it('includes custom_labels when changed', () => {
    const params = baseUpdateParams();
    params.custom_labels = { label: 'new-value' };

    expect(toUpdateServiceBody(params)).toEqual({
      service_id: 'service_id',
      environment: undefined,
      cluster: undefined,
      replication_set: undefined,
      custom_labels: { values: { label: 'new-value' } },
    });
  });

  it('omits custom_labels when current is undefined and next is empty', () => {
    const params = baseUpdateParams();
    params.current.custom_labels = undefined;
    params.custom_labels = {};

    expect(toUpdateServiceBody(params).custom_labels).toBeUndefined();
  });

  it.each([
    ['environment', 'staging', { environment: 'staging' }],
    ['cluster', 'cluster-b', { cluster: 'cluster-b' }],
    ['replication_set', 'repl-2', { replication_set: 'repl-2' }],
  ] as const)('includes %s when changed', (property, value, expectedField) => {
    expect(toUpdateServiceBody(withLabelChange(property, value))).toEqual({
      service_id: 'service_id',
      environment: undefined,
      cluster: undefined,
      replication_set: undefined,
      custom_labels: undefined,
      ...expectedField,
    });
  });
});

describe('didLabelsChange', () => {
  it('returns false when nothing changed', () => {
    expect(didLabelsChange(baseUpdateParams())).toBe(false);
  });

  it('returns true when only custom labels changed', () => {
    const params = baseUpdateParams();
    params.custom_labels = { label: 'new-value' };

    expect(didLabelsChange(params)).toBe(true);
  });

  it.each([
    ['environment', 'staging'],
    ['cluster', 'cluster-b'],
    ['replication_set', 'repl-2'],
  ] as const)('returns true when only %s changed', (property, value) => {
    expect(didLabelsChange(withLabelChange(property, value))).toBe(true);
  });

  it('returns false when current custom_labels is undefined and next is empty', () => {
    const params = baseUpdateParams();
    params.current.custom_labels = undefined;
    params.custom_labels = {};

    expect(didLabelsChange(params)).toBe(false);
  });
});

import { ServiceAgentStatus } from 'app/percona/inventory/Inventory.types';
import { Service, ServiceListPayload } from 'app/percona/shared/services/services/Services.types';

import { Databases } from '../../types';

import { toDbServicesModel } from './services.utils';

describe('toDbServicesModel', () => {
  it('should correctly convert payload', () => {
    const payload: ServiceListPayload = {
      postgresql: [
        {
          service_id: 'p1',
          service_name: 'postgres one',
          node_id: 'node_1',
          node_name: 'node one',
          database_name: 'db1',
          address: 'localhost',
          port: '80',
          socket: '',
          agents: [
            {
              agent_id: 'agent_1',
              status: ServiceAgentStatus.RUNNING,
            },
          ],
        },
        {
          service_id: 'p2',
          service_name: 'postgres two',
          node_id: 'node_1',
          node_name: 'node one',
          database_name: 'db2',
          address: 'localhost',
          port: '81',
          socket: '',
        },
      ],
      mongodb: [
        {
          service_id: 'mongo1',
          service_name: 'mongo one',
          node_id: 'node_2',
          node_name: 'node two',
          address: 'localhost',
          port: '83',
          socket: '',
          custom_labels: {
            env: 'dev',
          },
        },
      ],
      external: [
        {
          service_id: 'external1',
          service_name: 'external one',
          node_id: 'node_1',
          node_name: 'node one',
          group: 'g1',
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
          port: '80',
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
          address: 'localhost',
          port: '81',
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
          address: 'localhost',
          port: '83',
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
          customLabels: {
            group: 'g1',
          },
        },
      },
    ]);
  });
});

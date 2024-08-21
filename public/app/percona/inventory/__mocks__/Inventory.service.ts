import * as service from 'app/percona/inventory/Inventory.service';
import { DBServiceList } from 'app/percona/inventory/Inventory.types';

export const stubWithLabels = {
  service_id: 'service_id',
  service_name: 'mysql-with-labels',
  node_id: 'node_id',
  address: 'mysql',
  port: 3306,
  environment: 'Env',
  cluster: 'Clu',
  replication_set: 'Repl',
  custom_labels: {
    label: 'value',
    label2: 'value2',
  },
};

export const stubs: DBServiceList = {
  mysql: [
    {
      id: 'service_1',
      name: 'Service 1',
    },
    {
      id: 'service_2',
      name: 'Service 2',
    },
  ],
};

const nodesMock =[
    {
      node_id: 'pmm-server',
      node_type: 'generic',
      node_name: 'pmm-server',
      machine_id: '',
      distro: '',
      node_model: '',
      container_id: '',
      container_name: '',
      address: '127.0.0.1',
      region: '',
      az: '',
      custom_labels: {},
      created_at: '2024-08-20T08:05:31.079300Z',
      updated_at: '2024-08-20T08:05:31.079300Z',
      status: 'STATUS_UP',
      agents: [
        {
          agent_id: '05af4544-8fd0-4788-b841-89ed6caa9ac1',
          agent_type: 'node_exporter',
          status: 'AGENT_STATUS_RUNNING',
          is_connected: false
        },
        {
          agent_id: 'pmm-server',
          agent_type: 'pmm-agent',
          status: '',
          is_connected: true
        }
      ],
      services: [
        {
          service_id: '291afb9b-2ae0-41d1-a173-f1a138cf1725',
          service_type: 'postgresql',
          service_name: 'pmm-server-postgresql'
        }
      ]
    }
  ];

export const InventoryService = jest.genMockFromModule<typeof service>(
  'app/percona/inventory/Inventory.service'
).InventoryService;

InventoryService.getDbServices = () => Promise.resolve(stubs);

InventoryService.getService = () =>
  Promise.resolve({
    mysql: stubWithLabels,
  });

InventoryService.getNodes = () =>
  Promise.resolve({
    nodes: nodesMock,
  });

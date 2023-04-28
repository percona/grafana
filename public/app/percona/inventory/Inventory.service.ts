import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { DbAgent, ServiceStatus } from '../shared/services/services/Services.types';

import { CompatibleServiceListPayload, DBServiceList, ServiceAgentListPayload } from './Inventory.types';

const BASE_URL = `/v1/inventory`;

interface RemoveAgentBody {
  agent_id: string;
  force: boolean;
}
export interface RemoveNodeBody {
  node_id: string;
  force: boolean;
}

interface NodeFromDbAgent {
  agent_id: string;
  agent_type: string;
  status: ServiceStatus;
  is_connected: boolean;
}

interface ServiceInNodeList {
  service_id: string;
  service_type: string;
  service_name: string;
}

export interface NodeFe {
  nodeId: string;
  nodeType: string;
  nodeName: string;
  machineId: string;
  distro: string;
  address: string;
  nodeModel?: string;
  region?: string;
  az?: string;
  containerId: string;
  containerName: string;
  customLabels?: Record<string, string>;
  agents?: DbAgent[];
  createdAt: string;
  updatedAt: string;
  status: ServiceStatus;
  services: ServiceInNodeList[];
}

export interface NodeFromDb {
  node_id: string;
  node_type: string;
  node_name: string;
  machine_id: string;
  distro: string;
  address: string;
  node_model?: string;
  region?: string;
  az?: string;
  container_id: string;
  container_name: string;
  custom_labels?: Record<string, string>;
  agents?: NodeFromDbAgent[];
  created_at: string;
  updated_at: string;
  status: ServiceStatus;
  services: ServiceInNodeList[];
}

export interface NodeListFromDBPayload {
  nodes: NodeFromDb[];
}

export const InventoryService = {
  getAgents(serviceId: string | undefined, nodeId: string | undefined, token?: CancelToken) {
    return api.post<ServiceAgentListPayload, object>(
      '/v1/management/Agent/List',
      { service_id: serviceId, node_id: nodeId },
      false,
      token
    );
  },
  removeAgent(body: RemoveAgentBody, token?: CancelToken) {
    return api.post<void, object>(`${BASE_URL}/Agents/Remove`, body, false, token);
  },
  // TODO unify typings and this function with getServices()
  async getDbServices(token?: CancelToken): Promise<DBServiceList> {
    const response = await api.post<CompatibleServiceListPayload, object>(
      `${BASE_URL}/Services/List`,
      {},
      false,
      token
    );
    const result: DBServiceList = {};

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (Object.keys(response) as Array<keyof CompatibleServiceListPayload>).forEach((db) => {
      const dbServices = response[db];

      if (dbServices?.length) {
        result[db] = dbServices.map(({ service_id, service_name }) => ({
          id: service_id,
          name: service_name,
        }));
      }
    });

    return result;
  },
  getNodes(body = {}, token?: CancelToken) {
    return api.post<NodeListFromDBPayload, object>(`/v1/management/Node/List`, body, false, token);
  },
  removeNode(body: RemoveNodeBody, token?: CancelToken) {
    return api.post<void, RemoveNodeBody>(`${BASE_URL}/Nodes/Remove`, body, false, token);
  },
};

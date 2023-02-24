import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { NodeListPayload } from '../shared/services/nodes/Nodes.types';

import { DBServiceList, ServiceAgentPayload, ServiceListPayload } from './Inventory.types';

const BASE_URL = `/v1/inventory`;

interface RemoveAgentBody {
  agent_id: string;
  force: boolean;
}
export interface RemoveNodeBody {
  node_id: string;
  force: boolean;
}

export const InventoryService = {
  getAgents(body = {}, token?: CancelToken) {
    return api.post<ServiceAgentPayload, object>(`${BASE_URL}/Agents/List`, body, false, token);
  },
  removeAgent(body: RemoveAgentBody, token?: CancelToken) {
    return api.post<void, object>(`${BASE_URL}/Agents/Remove`, body, false, token);
  },
  // TODO unify typings and this function with getServices()
  async getDbServices(token?: CancelToken): Promise<DBServiceList> {
    const response = await api.post<ServiceListPayload, object>(`${BASE_URL}/Services/List`, {}, false, token);
    const result: DBServiceList = {};

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (Object.keys(response) as Array<keyof ServiceListPayload>).forEach((db) => {
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
    return api.post<NodeListPayload, object>(`${BASE_URL}/Nodes/List`, body, false, token);
  },
  removeNode(body: RemoveNodeBody, token?: CancelToken) {
    return api.post<void, RemoveNodeBody>(`${BASE_URL}/Nodes/Remove`, body, false, token);
  },
};

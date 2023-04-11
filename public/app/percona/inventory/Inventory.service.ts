import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { Databases } from '../shared/core';

import { DBServiceList, ServiceListPayload } from './Inventory.types';

const BASE_URL = `/v1/inventory`;

interface RemoveServiceBody {
  service_id: string;
  force: boolean;
}
interface RemoveAgentBody {
  agent_id: string;
  force: boolean;
}
interface RemoveNodeBody {
  node_id: string;
  force: boolean;
}

export const InventoryService = {
  getAgents(body = {}, token?: CancelToken) {
    return api.post<void, object>(`${BASE_URL}/Agents/List`, body, false, token);
  },
  removeAgent(body: RemoveAgentBody, token?: CancelToken) {
    return api.post<void, object>(`${BASE_URL}/Agents/Remove`, body, false, token);
  },
  getServices(body = {}, token?: CancelToken) {
    return api.post<void, object>(`${BASE_URL}/Services/List`, body, false, token);
  },
  // TODO unify typings and this function with getServices()
  async getDbServices(token?: CancelToken): Promise<DBServiceList> {
    const response = await api.post<ServiceListPayload, object>(`${BASE_URL}/Services/List`, {}, false, token);
    const result: DBServiceList = {};

    // @ts-ignore
    Object.keys(response).forEach((db: Databases) => {
      const dbServices = response[db];

      if (dbServices?.length) {
        result[db] = dbServices.map(({ service_id, service_name, cluster }) => ({
          id: service_id,
          name: service_name,
          cluster,
        }));
      }
    });

    return result;
  },
  removeService(body: RemoveServiceBody, token?: CancelToken) {
    return api.post<void, RemoveServiceBody>(`${BASE_URL}/Services/Remove`, body, false, token);
  },
  getNodes(body = {}, token?: CancelToken) {
    return api.post<void, object>(`${BASE_URL}/Nodes/List`, body, false, token);
  },
  removeNode(body: RemoveNodeBody, token?: CancelToken) {
    return api.post<void, RemoveNodeBody>(`${BASE_URL}/Nodes/Remove`, body, false, token);
  },
};

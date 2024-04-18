/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import {
  CompatibleServiceListPayload,
  DBServiceList,
  NodeListDBPayload,
  RemoveAgentBody,
  RemoveNodeBody,
  ServiceAgentListPayload,
} from './Inventory.types';

const BASE_URL = `/v1/inventory`;

export const InventoryService = {
  getAgents(serviceId: string | undefined, nodeId: string | undefined) {
    return api.get<ServiceAgentListPayload, object>(
      `/v1/management/agents?service_id=${serviceId}&node_id=${nodeId}`,
    );
  },
  removeAgent(body: RemoveAgentBody) {
    return api.delete<void>(`${BASE_URL}/agents/${body.id}`);
  },
  // TODO unify typings and this function with getServices()
  async getDbServices(): Promise<DBServiceList> {
    const response = await api.get<CompatibleServiceListPayload, object>(
      `${BASE_URL}/services`
    );
    const result: DBServiceList = {};

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (Object.keys(response) as Array<keyof CompatibleServiceListPayload>).forEach((db) => {
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
  getNodes(body = {}) {
    return api.get<NodeListDBPayload, object>(`/v1/management/nodes`);
  },
  removeNode(body: RemoveNodeBody) {
    return api.delete<void>(`${BASE_URL}/nodes/${body.node_id}`);
  },
  getService(serviceId: string) {
    return api.get<any, any>(`${BASE_URL}/services/${serviceId}`);
  },
};

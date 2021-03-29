import { api } from 'app/percona/shared/helpers/api';
import { Databases } from '../shared/core';
import { ServiceList, ServiceListPayload } from './Inventory.types';

const BASE_URL = `/v1/inventory/Services`;

export const InventoryService = {
  async getServices(): Promise<ServiceList> {
    const response = await api.post<ServiceListPayload, any>(`${BASE_URL}/List`, {});
    const result: ServiceList = {};

    Object.keys(response).forEach((db: Databases) => {
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
};

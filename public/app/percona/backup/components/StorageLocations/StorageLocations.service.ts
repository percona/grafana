import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { StorageLocationListReponse, StorageLocationReponse } from './StorageLocations.types';

const BASE_URL = '/v1/backup/locations';

export const StorageLocationsService = {
  async list(): Promise<StorageLocationListReponse> {
    return api.get(`${BASE_URL}`);
  },
  async add(payload: Partial<StorageLocationReponse>, token?: CancelToken): Promise<void> {
    return api.post(`${BASE_URL}`, payload, false, token);
  },
  async update(payload: Partial<StorageLocationReponse>, token?: CancelToken): Promise<void> {
    return api.put(`${BASE_URL}/${payload.location_id}`, payload);
  },
  async testLocation(payload: Partial<StorageLocationReponse>, token?: CancelToken): Promise<boolean> {
    return api.post(`${BASE_URL}:testConfig`, payload, false, token);
  },
  async delete(locationID: string, force: boolean): Promise<void> {
    return api.delete(`${BASE_URL}/${locationID}?force=${force}`);
  },
};

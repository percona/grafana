import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { StorageLocationListReponse, StorageLocationReponse } from './StorageLocations.types';

const BASE_URL = '/v1/management/backup/Locations';

export const StorageLocationsService = {
  async list(token?: CancelToken): Promise<StorageLocationListReponse> {
    return api.post(`${BASE_URL}/List`, {});
  },
  async add(payload: Partial<StorageLocationReponse>, token?: CancelToken): Promise<void> {
    return api.post(`${BASE_URL}/Add`, payload, false, token);
  },
  async update(payload: Partial<StorageLocationReponse>, token?: CancelToken): Promise<void> {
    return api.post(`${BASE_URL}/Change`, payload, false, token);
  },
  async testLocation(payload: Partial<StorageLocationReponse>, token?: CancelToken): Promise<boolean> {
    return api.post(`${BASE_URL}/TestConfig`, payload, false, token);
  },
  async delete(locationID: string, force: boolean, token?: CancelToken): Promise<void> {
    return api.post(`${BASE_URL}/Remove`, { location_id: locationID, force });
  },
};

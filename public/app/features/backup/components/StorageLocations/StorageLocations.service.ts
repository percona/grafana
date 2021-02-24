import { api } from 'app/percona/shared/helpers/api';
import { StorageLocationListReponse, StorageLocationReponse } from './StorageLocations.types';

const BASE_URL = '/v1/management/backup/Locations';

export const StorageLocationsService = {
  async list(): Promise<StorageLocationListReponse> {
    return api.post(`${BASE_URL}/List`, {});
  },
  async add(payload: StorageLocationReponse): Promise<void> {
    return api.post(`${BASE_URL}/Add`, payload);
  },
  async update(payload: StorageLocationReponse): Promise<void> {
    return api.post(`${BASE_URL}/Change`, payload);
  },
  async testLocation(payload: StorageLocationReponse): Promise<boolean> {
    const partial: Partial<StorageLocationReponse> = payload;
    delete partial.location_id;
    delete partial.name;
    delete partial.description;

    return Promise.resolve(true);
    // return api.post(`${BASE_URL}/TestConfig`, partial);
  },
};

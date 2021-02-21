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
    return getBackendSrv().post(`${BASE_URL}/Change`, payload);
  },
};

import { api } from 'app/percona/shared/helpers/api';
import { StorageLocationListReponse } from './StorageLocations.types';

const BASE_URL = '/v1/management/backup/Locations';

export const StorageLocationsService = {
  async list(): Promise<StorageLocationListReponse> {
    return api.post(`${BASE_URL}/List`, {});
  },
};

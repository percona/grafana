import { api } from 'app/percona/shared/helpers/api';
import { StorageLocationListReponse } from './StorageLocations.types';

const BASE_URL = '/v1/management/backup/Locations';

export const StorageLocationsService = {
  async list(): Promise<StorageLocationListReponse> {
    return api.post(`${BASE_URL}/List`, {});
  },
  async delete(locationID: string): Promise<void> {
    // TODO remove force: true after adding checkbox to deletion modal
    api.post(`${BASE_URL}/Remove`, { location_id: locationID, force: true });
  },
};

import { getBackendSrv } from '@grafana/runtime';
import { api } from 'app/percona/shared/helpers/api';
import { StorageLocationListReponse } from './StorageLocations.types';

const BASE_URL = '/v1/management/backup/Locations';

export const StorageLocationsService = {
  async list(): Promise<StorageLocationListReponse> {
    return getBackendSrv().post(`${BASE_URL}/List`);
  },
  async delete(locationID: string): Promise<void> {
    api.post(`${BASE_URL}/Remove`, { location_id: locationID });
  },
};

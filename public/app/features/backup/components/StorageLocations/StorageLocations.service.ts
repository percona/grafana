import { getBackendSrv } from '@grafana/runtime';
import { LocationListResponse } from './StorageLocations.types';

const BASE_URL = `${window.location.origin}/v1/management/backup/Locations`;

export const StorageLocationsService = {
  async list(): Promise<LocationListResponse> {
    return getBackendSrv().post(`${BASE_URL}/List`);
  },
};

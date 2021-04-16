import { api } from 'app/percona/shared/helpers/api';
import { Restore, RestoreResponse } from './RestoreHistory.types';

const BASE_URL = '/v1/management/backup';

export const RestoreHistoryService = {
  async list(): Promise<Restore[]> {
    const { items = [] } = await api.post<RestoreResponse, any>(`${BASE_URL}/RestoreHistory/List`, {});
    return items.map(
      ({
        restore_id,
        name,
        vendor,
        service_id,
        service_name,
        location_id,
        location_name,
        status,
        started_at,
        finished_at,
        data_model,
      }): Restore => ({
        id: restore_id,
        name,
        vendor,
        status,
        started: new Date(started_at).getTime(),
        finished: new Date(finished_at).getTime(),
        locationId: location_id,
        locationName: location_name,
        serviceId: service_id,
        serviceName: service_name,
        dataModel: data_model,
      })
    );
  },
};

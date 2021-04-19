//@ts-nocheck
import { Databases } from 'app/percona/shared/core';
import { api } from 'app/percona/shared/helpers/api';
import { DataModel, RestoreStatus } from '../../Backup.types';
import { Restore, RestoreResponse } from './RestoreHistory.types';

const BASE_URL = '/v1/management/backup';

export const RestoreHistoryService = {
  async list(): Promise<Restore[]> {
    // const { items = [] } = await api.post<RestoreResponse, any>(`${BASE_URL}/RestoreHistory/List`, {});
    return [
      {
        id: 'restore_1',
        name: 'Restore 1',
        locationId: 'location_1',
        locationName: 'Location 1',
        started: 1615912580244,
        finished: 1615912580244,
        serviceId: 'service_1',
        serviceName: 'Service 1',
        dataModel: DataModel.LOGICAL,
        status: RestoreStatus.RESTORE_STATUS_SUCCESS,
        vendor: Databases.mysql,
      },
      {
        id: 'restore_2',
        name: 'Restore 2',
        locationId: 'location_2',
        locationName: 'Location 2',
        started: 1615912580244,
        finished: 1615912580244,
        serviceId: 'service_2',
        serviceName: 'Service 2',
        dataModel: DataModel.PHYSICAL,
        status: RestoreStatus.RESTORE_STATUS_IN_PROGRESS,
        vendor: Databases.mysql,
      },
    ];
  },
};

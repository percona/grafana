import { Databases } from 'app/percona/shared/core';
import { DataModel, Status } from '../BackupInventory/BackupInventory.types';
import { Restore } from './RestoreHistory.types';

export const RestoreHistoryService = {
  async list(): Promise<Restore[]> {
    return [
      {
        id: 'restore_1',
        name: 'Restore 1',
        locationId: 'location_1',
        locationName: 'Location 1',
        created: 1615912580244,
        serviceId: 'service_1',
        serviceName: 'Service 1',
        dataModel: DataModel.LOGICAL,
        status: Status.SUCCESS,
        vendor: Databases.mysql,
      },
      {
        id: 'restore_2',
        name: 'Restore 2',
        locationId: 'location_2',
        locationName: 'Location 2',
        created: 1615912580244,
        serviceId: 'service_2',
        serviceName: 'Service 2',
        dataModel: DataModel.PHYSICAL,
        status: Status.IN_PROGRESS,
        vendor: Databases.mysql,
      },
    ];
  },
};

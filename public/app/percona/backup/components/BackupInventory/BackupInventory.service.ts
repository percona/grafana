//@ts-nocheck
import { api } from 'app/percona/shared/helpers/api';
import { Backup, BackupResponse, DataModel, Status } from './BackupInventory.types';

const BASE_URL = '/v1/management/backup/Artifacts';

export const BackupInventoryService = {
  async list(): Promise<Backup[]> {
    const { backups = [] } = await api.post<BackupResponse, any>(`${BASE_URL}/List`, {});
    return [
      {
        id: 'backup_1',
        name: 'Backup 1',
        locationId: 'location_1',
        locationName: 'Location 1',
        created: 1615912580244,
        serviceId: 'service_1',
        serviceName: 'Service 1',
        dataModel: DataModel.LOGICAL,
        status: Status.SUCCESS,
        vendor: 'PostgreSQL',
      },
      {
        id: 'backup_2',
        name: 'Backup 2',
        locationId: 'location_2',
        locationName: 'Location 2',
        created: 1615912580244,
        serviceId: 'service_3',
        serviceName: 'Service 3',
        dataModel: DataModel.PHYSICAL,
        status: Status.IN_PROGRESS,
        vendor: 'PostgreSQL',
      },
    ];
  },
};

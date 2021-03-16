import { api } from 'app/percona/shared/helpers/api';
import { Backup, BackupResponse, DataModel, Status } from './BackupInventory.types';

const BASE_URL = '/v1/management/backup/Artifacts';

export const BackupInventoryService = {
  async list(): Promise<Backup[]> {
    return api
      .post<BackupResponse, any>(`${BASE_URL}/List`, {})
      .then(
        ({
          backups = [
            {
              backup_id: 'backup_1',
              name: 'Backup 1',
              location_id: 'location_1',
              location_name: 'Location 1',
              created_at: '2021-03-16T16:36:20.244Z',
              service_id: 'service_1',
              service_name: 'Service 1',
              data_model: DataModel.LOGICAL,
              status: Status.SUCCESS,
              vendor: 'PostgreSQL',
            },
          ],
        }) =>
          backups.map(
            ({
              backup_id,
              name,
              location_id,
              location_name,
              created_at,
              service_id,
              service_name,
              data_model,
              status,
              vendor,
            }): Backup => ({
              id: backup_id,
              name,
              created: new Date(created_at).getTime(),
              locationId: location_id,
              locationName: location_name,
              serviceId: service_id,
              serviceName: service_name,
              dataModel: data_model,
              status,
              vendor,
            })
          )
      );
  },
};

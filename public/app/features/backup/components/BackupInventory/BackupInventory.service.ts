import { api } from 'app/percona/shared/helpers/api';
import { Backup, BackupResponse } from './BackupInventory.types';

const BASE_URL = '/v1/management/backup/Backups';

export const BackupInventoryService = {
  async list(): Promise<Backup[]> {
    return api.post<BackupResponse, any>(`${BASE_URL}/List`, {}).then(({ backups = [] }) =>
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
        })
      )
    );
  },
};

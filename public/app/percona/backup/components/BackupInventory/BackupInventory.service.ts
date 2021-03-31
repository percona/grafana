import { api } from 'app/percona/shared/helpers/api';
import { Backup, BackupResponse } from './BackupInventory.types';

const BASE_URL = '/v1/management/backup';

export const BackupInventoryService = {
  async list(): Promise<Backup[]> {
    const { backups = [] } = await api.post<BackupResponse, any>(`${BASE_URL}/Artifacts/List`, {});
    return backups.map(
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
    );
  },
  async restore(serviceId: string, locationId: string, artifactId: string): Promise<any> {
    return api.post(`${BASE_URL}/Backups/StartBackup`, {
      service_id: serviceId,
      location_id: locationId,
      artifact_id: artifactId,
    });
  },
};

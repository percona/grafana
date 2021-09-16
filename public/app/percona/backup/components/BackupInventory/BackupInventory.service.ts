import { api } from 'app/percona/shared/helpers/api';
import { CancelToken } from 'axios';
import { BackupLogResponse, BackupLogs } from '../../Backup.types';
import { Backup, BackupResponse } from './BackupInventory.types';

const BASE_URL = '/v1/management/backup';

export const BackupInventoryService = {
  async list(token?: CancelToken): Promise<Backup[]> {
    const { artifacts = [] } = await api.post<BackupResponse, any>(`${BASE_URL}/Artifacts/List`, {}, false, token);
    return artifacts.map(
      ({
        artifact_id,
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
        id: artifact_id,
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
  async restore(serviceId: string, artifactId: string, token?: CancelToken) {
    return api.post(
      `${BASE_URL}/Backups/Restore`,
      {
        service_id: serviceId,
        artifact_id: artifactId,
      },
      false,
      token
    );
  },
  async backup(
    serviceId: string,
    locationId: string,
    name: string,
    description: string,
    retryInterval: string,
    retryTimes: number,
    token?: CancelToken
  ) {
    return api.post(
      `${BASE_URL}/Backups/Start`,
      {
        service_id: serviceId,
        location_id: locationId,
        name,
        description,
        retry_interval: retryInterval,
        retries: retryTimes,
      },
      false,
      token
    );
  },
  async delete(artifactId: string, removeFiles: boolean) {
    return api.post(`${BASE_URL}/Artifacts/Delete`, { artifact_id: artifactId, remove_files: removeFiles });
  },
  async getLogs(artifactId: string, startingChunk: number, offset: number, token?: CancelToken): Promise<BackupLogs> {
    const { logs = [], end } = await api.post<BackupLogResponse, any>(
      `${BASE_URL}/Backups/GetLogs`,
      {
        artifact_id: artifactId,
        offset: startingChunk,
        limit: offset,
      },
      false,
      token
    );

    return {
      logs: logs.map(({ chunk_id = 0, message, time }) => ({ id: chunk_id, message, time })),
      end,
    };
  },
};

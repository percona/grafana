import { api } from 'app/percona/shared/helpers/api';
import { BackupResponse } from './BackupInventory.types';

const BASE_URL = '/v1/management/backup/Backups';

export const BackupInventoryService = {
  async list(): Promise<BackupResponse> {
    return api.post(`${BASE_URL}/List`, {});
  },
};

import { CancelToken } from 'axios';
import { Databases } from 'app/percona/shared/core';
import { ScheduledBackup } from './ScheduledBackups.types';
import { BackupType, DataModel } from '../../Backup.types';

export const ScheduledBackupsService = {
  async list(token?: CancelToken): Promise<ScheduledBackup[]> {
    return [
      {
        id: 'backup_1',
        name: 'Backup 1',
        vendor: Databases.postgresql,
        start: Date.now(),
        retention: 10,
        cronExpression: '30 * * * *',
        locationId: 'bucket_1',
        locationName: 'Bucker 1',
        serviceId: 'service_1',
        serviceName: 'Service 1',
        lastBackup: Date.now(),
        dataModel: DataModel.PHYSICAL,
        description: 'Just a bare description',
        type: BackupType.FULL,
      },
    ];
  },
};

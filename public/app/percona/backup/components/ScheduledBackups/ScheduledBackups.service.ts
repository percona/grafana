import { CancelToken } from 'axios';
import { Databases } from 'app/percona/shared/core';
import { Frequency, ScheduledBackup } from './ScheduledBackups.types';
import { DataModel } from '../../Backup.types';

export const ScheduledBackupsService = {
  async list(token?: CancelToken): Promise<ScheduledBackup[]> {
    return [
      {
        name: 'Backup 1',
        vendor: Databases.postgresql,
        start: Date.now(),
        retention: {
          daily: 10,
          weekly: 10,
        },
        frequency: {
          value: 1,
          unit: Frequency.DAY,
        },
        location: 'bucket 1',
        lastBackup: Date.now(),
        dataModel: DataModel.PHYSICAL,
        description: 'Just a bare description',
      },
    ];
  },
};

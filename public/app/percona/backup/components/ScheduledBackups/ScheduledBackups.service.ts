import { CancelToken } from 'axios';
import { Databases } from 'app/percona/shared/core';
import { ScheduledBackup, ScheduledBackupResponse } from './ScheduledBackups.types';
import { BackupType, DataModel, RetryMode } from '../../Backup.types';

export const ScheduledBackupsService = {
  async list(token?: CancelToken): Promise<ScheduledBackup[]> {
    const response: ScheduledBackupResponse = {
      scheduled_backups: [
        {
          scheduled_backup_id: 'backup_1',
          service_id: 'service_1',
          service_name: 'Service 1',
          location_id: 'location 1',
          location_name: 'Location 1',
          cron_expression: '30 * * * *',
          start_time: '2021-06-09T12:58:19.401Z',
          name: 'Backup 1',
          description: 'Description',
          retry_mode: RetryMode.MANUAL,
          retry_interval: '10s',
          retry_times: 1,
          vendor: Databases.mysql,
          last_run: '2021-06-09T12:58:19.401Z',
          data_model: DataModel.PHYSICAL,
        },
      ],
    };
    const { scheduled_backups = [] } = response;
    return scheduled_backups.map(
      ({
        scheduled_backup_id,
        name,
        vendor,
        start_time,
        cron_expression,
        location_id,
        location_name,
        service_id,
        service_name,
        last_run,
        data_model,
        description,
        retry_mode,
        retry_times,
        retry_interval,
      }) => ({
        id: scheduled_backup_id,
        name,
        vendor,
        start: new Date(start_time).getTime(),
        retention: 0,
        cronExpression: cron_expression,
        locationId: location_id,
        locationName: location_name,
        serviceId: service_id,
        serviceName: service_name,
        lastBackup: new Date(last_run).getTime(),
        dataModel: data_model,
        description,
        type: BackupType.FULL,
        retryMode: retry_mode,
        retryTimes: retry_times,
        retryInterval: retry_interval,
      })
    );
  },
};

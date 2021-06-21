import { CancelToken } from 'axios';
import { api } from 'app/percona/shared/helpers/api';
import { ScheduledBackup, ScheduledBackupResponse } from './ScheduledBackups.types';
import { BackupType } from '../../Backup.types';

const BASE_URL = '/v1/management/backup/Backups';

export const ScheduledBackupsService = {
  async list(token?: CancelToken): Promise<ScheduledBackup[]> {
    const { scheduled_backups = [] } = await api.post<ScheduledBackupResponse, any>(
      `${BASE_URL}/ListScheduled`,
      {},
      false,
      token
    );

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
        enabled,
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
        lastBackup: last_run ? new Date(last_run).getTime() : undefined,
        dataModel: data_model,
        description,
        type: BackupType.FULL,
        retryMode: retry_mode,
        retryTimes: retry_times,
        retryInterval: retry_interval,
        enabled,
      })
    );
  },
};

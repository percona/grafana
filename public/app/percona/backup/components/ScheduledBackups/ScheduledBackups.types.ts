import { Databases } from 'app/percona/shared/core';
import { DataModel, RetryMode } from '../../Backup.types';

export interface RawScheduledBackup {
  scheduled_backup_id: string;
  service_id: string;
  service_name: string;
  location_id: string;
  location_name: string;
  cron_expression: string;
  start_time: string;
  name: string;
  description: string;
  retry_mode: RetryMode;
  retry_interval: string;
  retry_times: string;
}

export interface ScheduledBackupResponse {
  scheduled_backups: RawScheduledBackup[];
}

export interface ScheduledBackup {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
  serviceId: string;
  serviceName: string;
  vendor: Databases;
  start: number;
  retention: number;
  cronExpression: string;
  lastBackup: number;
  dataModel: DataModel;
  description: string;
}

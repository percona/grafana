import { Databases } from 'app/percona/shared/core';
import { DataModel } from '../../Backup.types';

export interface ScheduledBackupRetention {
  daily: number;
  weekly: number;
}

export enum Frequency {
  DAY = 'Day',
  WEEK = 'Week',
}

export interface ScheduledBackupFrequency {
  value: number;
  unit: Frequency;
}

export interface ScheduledBackup {
  name: string;
  vendor: Databases;
  start: number;
  retention: ScheduledBackupRetention;
  frequency: ScheduledBackupFrequency;
  location: string;
  lastBackup: number;
  dataModel: DataModel;
  description: string;
}

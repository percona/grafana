import { SelectableValue } from '@grafana/data';
import { DataModel } from 'app/percona/backup/Backup.types';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { RetryMode } from './AddBackupModal.types';

export const VENDOR_OPTIONS: Array<SelectableValue<Databases>> = [
  {
    value: Databases.mysql,
    label: DATABASE_LABELS.mysql,
  },
  {
    value: Databases.mongodb,
    label: DATABASE_LABELS.mongodb,
  },
  {
    value: Databases.postgresql,
    label: DATABASE_LABELS.postgresql,
  },
  {
    value: Databases.proxysql,
    label: DATABASE_LABELS.proxysql,
  },
];

export const DATA_MODEL_OPTIONS: Array<SelectableValue<DataModel>> = [
  {
    value: DataModel.PHYSICAL,
    label: 'Physical',
  },
  {
    value: DataModel.LOGICAL,
    label: 'Logical',
  },
];

export const RETRY_MODE_OPTIONS: Array<SelectableValue<RetryMode>> = [
  {
    value: RetryMode.AUTO,
    label: 'Auto',
  },
  {
    value: RetryMode.MANUAL,
    label: 'Manual',
  },
];

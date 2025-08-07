import { SelectableValue } from '@grafana/data';
import { DataModel, RetryMode, Compression } from 'app/percona/backup/Backup.types';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { capitalizeText } from 'app/percona/shared/helpers/capitalizeText';
import { MONTHS, WEEKDAYS } from 'app/percona/shared/helpers/cron/constants';

import { Messages } from './AddBackupPage.messages';
import { getOptionFromDigit } from './AddBackupPage.utils';

export const SCHEDULED_TYPE = 'scheduled_task_id';

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

export const PAGE_SWITCHER_OPTIONS: Array<SelectableValue<string>> = [
  { value: 'demand', label: Messages.onDemand },
  {
    value: 'scheduled',
    label: Messages.schedule,
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

export const MONTH_OPTIONS: Array<SelectableValue<number>> = MONTHS.map((month, idx) => ({
  value: idx + 1,
  label: capitalizeText(month),
}));

export const DAY_OPTIONS: Array<SelectableValue<number>> = Array.from(Array(31).keys()).map((value) =>
  getOptionFromDigit(value + 1)
);

export const WEEKDAY_OPTIONS: Array<SelectableValue<number>> = WEEKDAYS.map((day, idx) => ({
  value: idx,
  label: capitalizeText(day),
}));

export const HOUR_OPTIONS: Array<SelectableValue<number>> = Array.from(Array(24).keys()).map((value) =>
  getOptionFromDigit(value)
);

export const MINUTE_OPTIONS: Array<SelectableValue<number>> = Array.from(Array(60).keys()).map((value) =>
  getOptionFromDigit(value)
);

export const MAX_VISIBLE_OPTIONS = 4;

export const MIN_RETENTION = 0;

export const MAX_RETENTION = 99;

export const MAX_BACKUP_NAME = 100;

export const COMPRESSION_OPTIONS: Array<SelectableValue<string>> = [
  {
    value: Compression.NONE,
    label: 'No compression',
  },
  {
    value: Compression.QUICKLZ,
    label: 'QuickLZ compression',
  },
  {
    value: Compression.ZSTD,
    label: 'Zstandard compression',
  },
  {
    value: Compression.LZ4,
    label: 'LZ4 compression',
  },
  {
    value: Compression.S2,
    label: 'S2 compression',
  },
  {
    value: Compression.GZIP,
    label: 'Gzip compression',
  },
  {
    value: Compression.SNAPPY,
    label: 'Snappy compression',
  },
  {
    value: Compression.PGZIP,
    label: 'Parallel Gzip compression',
  },
];

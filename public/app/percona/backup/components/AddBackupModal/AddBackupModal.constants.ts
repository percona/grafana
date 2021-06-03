import { SelectableValue } from '@grafana/data';
import { DataModel } from 'app/percona/backup/Backup.types';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { MONTHS, WEEKDAYS } from 'app/percona/shared/helpers/cron/constants';
import { PeriodType } from 'app/percona/shared/helpers/cron/types';
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

export const PERIOD_OPTIONS: Array<SelectableValue<PeriodType>> = [
  {
    value: 'year',
    label: 'Year',
  },
  {
    value: 'month',
    label: 'Month',
  },
  {
    value: 'week',
    label: 'Week',
  },
  {
    value: 'day',
    label: 'Day',
  },
  {
    value: 'hour',
    label: 'Hour',
  },
];

export const MONTH_OPTIONS: Array<SelectableValue<number>> = MONTHS.map((month, idx) => ({
  value: idx + 1,
  label: `${month[0].toUpperCase()}${month.substr(1).toLowerCase()}`,
}));

export const DAY_OPTIONS: Array<SelectableValue<number>> = Array.from(Array(31).keys()).map(value => ({
  value: value + 1,
  label: (value + 1).toString(),
}));

export const WEEKDAY_OPTIONS: Array<SelectableValue<number>> = WEEKDAYS.map((day, idx) => ({
  value: idx,
  label: `${day[0].toUpperCase()}${day.substr(1).toLowerCase()}`,
}));

export const HOUR_OPTIONS: Array<SelectableValue<number>> = Array.from(Array(24).keys()).map(value => ({
  value,
  label: value.toString(),
}));

export const MINUTE_OPTIONS: Array<SelectableValue<number>> = Array.from(Array(60).keys()).map(value => ({
  value,
  label: value.toString(),
}));

import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';

export const VENDOR_OPTIONS = [
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

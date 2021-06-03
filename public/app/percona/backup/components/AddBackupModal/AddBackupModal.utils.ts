import { SelectableValue } from '@grafana/data';
import { DataModel, RetryMode } from 'app/percona/backup/Backup.types';
import { PeriodType } from 'app/percona/shared/helpers/cron/types';
import { Backup } from '../BackupInventory.types';
import { AddBackupFormProps, SelectableService } from './AddBackupModal.types';

export const toFormBackup = (backup: Backup | null): AddBackupFormProps => {
  if (!backup) {
    return {
      service: (null as unknown) as SelectableValue<SelectableService>,
      dataModel: DataModel.PHYSICAL,
      backupName: '',
      description: '',
      location: (null as unknown) as SelectableValue<string>,
      retryMode: RetryMode.AUTO,
      retryTimes: 0,
      retryInterval: 0,
      period: { value: 'year', label: 'Year' },
      month: [],
      day: [],
      weekDay: [],
      startHour: [{ value: 0, label: '00' }],
      startMinute: [{ value: 0, label: '00' }],
      logs: false,
      active: false,
    };
  }

  const { serviceName, serviceId, vendor, dataModel, locationName, locationId } = backup;

  return {
    service: { label: serviceName, value: { id: serviceId, vendor } },
    dataModel,
    backupName: '',
    description: '',
    location: { label: locationName, value: locationId },
    retryMode: RetryMode.AUTO,
    retryTimes: 0,
    retryInterval: 0,
    period: { value: 'year', label: 'Year' },
    month: [],
    day: [],
    weekDay: [],
    startHour: [],
    startMinute: [],
    logs: false,
    active: false,
  };
};

export const isCronFieldDisabled = (period: PeriodType, field: keyof AddBackupFormProps) => {
  const map: Record<PeriodType, Array<Partial<keyof AddBackupFormProps>>> = {
    year: [],
    month: ['month'],
    week: ['month', 'day'],
    day: ['month', 'day', 'weekDay'],
    hour: ['month', 'day', 'weekDay', 'startHour'],
    minute: ['month', 'day', 'weekDay', 'startHour', 'startMinute'],
  };

  return map[period].includes(field);
};

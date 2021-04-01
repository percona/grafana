import { SelectableValue } from '@grafana/data';
import { Databases } from 'app/percona/shared/core';
import { Backup, DataModel } from '../BackupInventory.types';
import { AddBackupFormProps, RetryMode } from './AddBackupModal.types';

export const toFormBackup = (backup: Backup | null): AddBackupFormProps => {
  if (!backup) {
    return {
      service: (null as unknown) as SelectableValue<string>,
      vendor: Databases.mysql,
      dataModel: DataModel.PHYSICAL,
      backupName: '',
      description: '',
      location: (null as unknown) as SelectableValue<string>,
      retryMode: RetryMode.AUTO,
      retryTimes: 0,
      retryInterval: 0,
    };
  }

  const { serviceName, serviceId, vendor, dataModel, locationName, locationId } = backup;

  return {
    service: { label: serviceName, value: serviceId },
    vendor,
    dataModel,
    backupName: '',
    description: '',
    location: { label: locationName, value: locationId },
    retryMode: RetryMode.AUTO,
    retryTimes: 0,
    retryInterval: 0,
  };
};

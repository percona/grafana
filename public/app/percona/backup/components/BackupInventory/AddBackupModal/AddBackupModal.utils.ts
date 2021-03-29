import { Databases } from 'app/percona/shared/core';
import { Backup, DataModel } from '../BackupInventory.types';
import { AddBackupFormProps, RetryMode } from './AddBackupModal.types';

export const toFormBackup = (backup: Backup | null): AddBackupFormProps => {
  if (!backup) {
    return {
      serviceName: '',
      vendor: Databases.mysql,
      dataModel: DataModel.PHYSICAL,
      backupName: '',
      description: '',
      location: '',
      retryMode: RetryMode.AUTO,
      retryTimes: 0,
      retryInterval: 0,
    };
  }

  const { serviceName, vendor, dataModel, locationName } = backup;

  return {
    serviceName,
    vendor,
    dataModel,
    backupName: '',
    description: '',
    location: locationName,
    retryMode: RetryMode.AUTO,
    retryTimes: 0,
    retryInterval: 0,
  };
};

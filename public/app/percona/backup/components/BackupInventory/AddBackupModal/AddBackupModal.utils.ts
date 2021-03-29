import { SelectableValue } from '@grafana/data';
import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { Backup, DataModel } from '../BackupInventory.types';
import { AddBackupFormProps, RetryMode } from './AddBackupModal.types';

export const toFormBackup = (backup: Backup | null): AddBackupFormProps => {
  if (!backup) {
    return {
      serviceName: '',
      vendor: '',
      dataModel: DataModel.PHYSICAL,
      databases: [],
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
    databases: [],
    backupName: '',
    description: '',
    location: locationName,
    retryMode: RetryMode.AUTO,
    retryTimes: 0,
    retryInterval: 0,
  };
};

export const loadServiceOptions = async (): Promise<Array<SelectableValue<string>>> => {
  let result: Array<SelectableValue<string>> = [];
  const services = await InventoryService.getServices();

  // TODO remove this constraint when more DB types are supported
  if (services.mysql) {
    result = services.mysql.map(({ id, name }): SelectableValue<string> => ({ label: name, value: id }));
  }

  return result;
};

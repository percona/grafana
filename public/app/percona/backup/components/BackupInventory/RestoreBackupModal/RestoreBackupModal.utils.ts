import { Backup } from '../BackupInventory.types';
import { formatDataModel } from '../BackupInventory.utils';
import { RestoreBackupFormProps, ServiceTypeSelect } from './RestoreBackupModal.types';

export const toFormProps = (backup: Backup): RestoreBackupFormProps => ({
  serviceType: ServiceTypeSelect.SAME,
  vendor: backup.vendor,
  serviceName: backup.serviceName,
  dataModel: formatDataModel(backup.dataModel),
});

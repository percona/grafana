import { Backup } from '../BackupInventory.types';
import { formatDataModel } from '../BackupInventory.utils';
import { RestoreBackupFormProps, ServiceTypeSelect } from './RestoreBackupModal.types';

export const toFormProps = ({ vendor, serviceId, serviceName, dataModel }: Backup): RestoreBackupFormProps => ({
  serviceType: ServiceTypeSelect.SAME,
  vendor: vendor,
  service: { label: serviceName, value: serviceId },
  dataModel: formatDataModel(dataModel),
});

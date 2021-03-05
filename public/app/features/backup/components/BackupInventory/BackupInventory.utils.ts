import { Backup, RawBackup } from './BackupInventory.types';

export const formatToBackup = ({ name, location_name, backup_id, created_at }: RawBackup): Backup => ({
  id: backup_id,
  name,
  created: new Date(created_at).getTime(),
  location: location_name,
});

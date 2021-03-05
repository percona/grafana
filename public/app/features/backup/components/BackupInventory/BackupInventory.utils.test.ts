import { RawBackup } from './BackupInventory.types';
import { formatToBackup } from './BackupInventory.utils';

describe('BackupInventory::utils', () => {
  it('should correctly format', () => {
    const backup: RawBackup = {
      backup_id: 'ID_1',
      name: 'backup',
      location_name: 'location',
      created_at: '2021-03-05T15:49:41.627332Z',
    };
    expect(formatToBackup(backup)).toEqual({
      id: backup.backup_id,
      name: backup.name,
      created: 1614959381627,
      location: backup.location_name,
    });
  });
});

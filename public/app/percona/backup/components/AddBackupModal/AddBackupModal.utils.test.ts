import { stubs as backupStubs } from '../BackupInventory/__mocks__/BackupInventory.service';
import { BackupType, DataModel, RetryMode } from 'app/percona/backup/Backup.types';
import { ScheduledBackup } from '../ScheduledBackups/ScheduledBackups.types';
import { AddBackupFormProps } from './AddBackupModal.types';
import { toFormBackup } from './AddBackupModal.utils';
import { Databases } from 'app/percona/shared/core';

describe('AddBackupModal::utils', () => {
  describe('toFormBackup', () => {
    it('should return default values if a null Backup is passed', () => {
      expect(toFormBackup(null)).toEqual<AddBackupFormProps>({
        service: null as any,
        dataModel: DataModel.PHYSICAL,
        backupName: '',
        description: '',
        location: null as any,
        retryMode: RetryMode.AUTO,
        retryTimes: 1,
        retryInterval: 1,
        period: { value: 'year', label: 'Year' },
        month: [],
        day: [],
        weekDay: [],
        startHour: [{ value: 0, label: '00' }],
        startMinute: [{ value: 0, label: '00' }],
        logs: false,
        active: false,
      });
    });

    it('should convert to form props', () => {
      const backup = backupStubs[0];
      const { serviceName, serviceId, vendor, dataModel, locationName, locationId } = backup;

      expect(toFormBackup(backup)).toEqual<AddBackupFormProps>({
        service: { label: serviceName, value: { id: serviceId, vendor } },
        dataModel,
        backupName: 'Backup 1',
        description: '',
        location: { label: locationName, value: locationId },
      });
    });

    it('should correctly convert a scheduled backup', () => {
      const backup: ScheduledBackup = {
        id: 'backup_1',
        name: 'Backup 1',
        locationId: 'location_1',
        locationName: 'Location 1',
        serviceId: 'service_1',
        serviceName: 'Service 1',
        vendor: Databases.mongodb,
        start: 1623584353170,
        retention: 0,
        cronExpression: '30 0 * * *',
        lastBackup: 1623584353170,
        dataModel: DataModel.PHYSICAL,
        description: '',
        type: BackupType.FULL,
        retryMode: RetryMode.MANUAL,
        retryInterval: '10s',
        retryTimes: 1,
        enabled: true,
      };

      expect(toFormBackup(backup)).toEqual<AddBackupFormProps>({
        service: { label: 'Service 1', value: { id: 'service_1', vendor: Databases.mongodb } },
        dataModel: DataModel.PHYSICAL,
        backupName: 'Backup 1',
        description: '',
        location: { label: 'Location 1', value: 'location_1' },
        retryMode: RetryMode.MANUAL,
        retryTimes: 1,
        retryInterval: 10,
        period: { value: 'day', label: 'Day' },
        month: [],
        day: [],
        weekDay: [],
        startHour: [{ value: 0, label: '00' }],
        startMinute: [{ value: 30, label: '30' }],
        logs: false,
        active: true,
      });
    });
  });
});

import { CancelToken } from 'axios';

import { SelectableValue } from '@grafana/data';

import { StorageLocationsService } from '../../../../../../backup/components/StorageLocations/StorageLocations.service';
import { DBaaSBackupService } from '../../DBaaSBackups/DBaaSBackups.service';

export const RestoreFromService = {
  async loadStorageLocations(token?: CancelToken): Promise<Array<SelectableValue<string>>> {
    const storageLocationsResponse = await StorageLocationsService.list(token);

    const storageLocations = storageLocationsResponse?.locations || [];
    return storageLocations.map((location) => ({
      label: location.name,
      value: location.location_id,
    }));
  },

  async loadBackupArtifacts(locationId: string): Promise<Array<SelectableValue<string>>> {
    const backupArtifactsResponse = await DBaaSBackupService.list(locationId);

    return backupArtifactsResponse.map((backup) => ({
      label: backup.key,
      value: backup.key,
    }));
  },
};

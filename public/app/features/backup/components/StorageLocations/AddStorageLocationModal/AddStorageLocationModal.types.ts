import { LocationType, StorageLocation } from '../StorageLocations.types';

export interface AddStorageLocationModalProps {
  isVisible: boolean;
  location?: StorageLocation;
  needsLocationValidation?: boolean;
  locationValid?: boolean;
  waitingLocationValidation?: boolean;
  onClose: () => void;
  onAdd: (location: StorageLocation) => void;
  onTest?: (location: StorageLocation) => void;
  onPathChanged?: () => any;
}

export interface AddStorageLocationFormProps {
  locationID?: string;
  name: string;
  description: string;
  type: LocationType;
  endpoint: string;
  client: string;
  server: string;
  accessKey: string;
  secretKey: string;
}

export interface TypeFieldCommonProps {
  onPathChanged?: () => void;
}

export interface TypeFieldProps {
  values: AddStorageLocationFormProps;
  onPathChanged?: () => void;
}

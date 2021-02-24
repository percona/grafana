import { LocationType, StorageLocation } from '../StorageLocations.types';

export interface AddStorageLocationModalProps {
  isVisible: boolean;
  location: StorageLocation | null;
  needsLocationValidation?: boolean;
  onClose: () => void;
  onAdd: (location: StorageLocation) => void;
  isLocationValid?: (location: StorageLocation) => boolean | Promise<boolean>;
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
  bucketName: string;
}

export interface TypeFieldCommonProps {
  onPathChanged?: () => void;
}

export interface TypeFieldProps {
  values: AddStorageLocationFormProps;
  onPathChanged?: () => void;
}

import { LocationType, StorageLocation } from '../StorageLocations.types';

export interface AddStorageLocationModalProps {
  isVisible: boolean;
  location: StorageLocation;
  onClose: () => void;
  onAdd: (location: StorageLocation) => void;
}

export interface AddStorageLocationFormProps {
  name: string;
  description: string;
  type: LocationType;
  endpoint: string;
  client: string;
  server: string;
  accessKey: string;
  secretKey: string;
}

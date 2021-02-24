import { StorageLocation } from '../StorageLocations.types';

export interface RemoveStorageLocationModalProps {
  location?: StorageLocation;
  isVisible: boolean;
  loading: boolean;
  onDelete: (location?: StorageLocation) => void;
  setVisible: (value: boolean) => void;
}

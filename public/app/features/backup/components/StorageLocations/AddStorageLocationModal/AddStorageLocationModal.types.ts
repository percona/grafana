import { StorageLocation } from '../StorageLocations.types';

export interface AddStorageLocationModalProps {
  isVisible: boolean;
  initialValues: StorageLocation;
}

export enum FormStorageType {
  S3 = 's3',
  CLIENT = 'client',
  SERVER = 'server',
}

export interface AddStorageLocationFormProps {
  name: string;
  description: string;
  type: FormStorageType;
  path: string;
  accessKey: string;
  secretKey: string;
}

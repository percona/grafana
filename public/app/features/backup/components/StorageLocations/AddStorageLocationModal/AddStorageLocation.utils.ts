import { StorageLocation, LocationType, S3Location } from '../StorageLocations.types';
import { AddStorageLocationFormProps } from './AddStorageLocationModal.types';

export const toStorageLocation = (values: AddStorageLocationFormProps): StorageLocation => {
  const { name, description, type, endpoint, client, server, accessKey, secretKey } = values;
  const result: Partial<StorageLocation> = { name, description, type };

  switch (type) {
    case LocationType.S3:
      result.path = endpoint;
      (result as S3Location).accessKey = accessKey;
      (result as S3Location).secretKey = secretKey;
      break;
    case LocationType.CLIENT:
      result.path = client;
      break;
    case LocationType.SERVER:
      result.path = server;
      break;
  }

  return result as StorageLocation;
};

export const toFormStorageLocation = (
  values: StorageLocation | S3Location | undefined
): AddStorageLocationFormProps => {
  if (!values) {
    return {
      name: '',
      description: '',
      type: LocationType.S3,
      endpoint: '',
      client: '',
      server: '',
      accessKey: '',
      secretKey: '',
    };
  }

  const { name, description, type, path } = values;
  const result: Partial<AddStorageLocationFormProps> = { name, description, type };

  switch (type) {
    case LocationType.S3:
      result.endpoint = path;
      result.accessKey = (values as S3Location).accessKey;
      result.secretKey = (values as S3Location).secretKey;
      break;
    case LocationType.CLIENT:
      result.client = path;
      break;
    case LocationType.SERVER:
      result.server = path;
      break;
  }

  return result as AddStorageLocationFormProps;
};

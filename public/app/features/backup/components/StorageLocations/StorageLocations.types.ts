export enum LocationType {
  s3 = 'S3',
  localClient = 'Local Client',
  localServer = 'Local Server',
}

export interface StorageLocation {
  name: string;
  description: string;
  type: LocationType;
  path: string;
}

export interface S3Location extends StorageLocation {
  accessKey: string;
  secretKey: string;
}

interface S3ConfigResponse {
  endpoint: string;
  access_key: string;
  secret_key: string;
}

interface FSConfigResponse {
  path: string;
}

export interface StorageLocationReponse {
  location_id: string;
  name: string;
  description: string;
  s3_config?: S3ConfigResponse;
  fs_config?: FSConfigResponse;
}

export interface StorageLocationListReponse {
  locations: StorageLocationReponse[];
}

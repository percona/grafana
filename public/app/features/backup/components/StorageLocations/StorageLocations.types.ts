export enum LocationType {
  s3 = 'S3',
  localClient = 'Local Client',
  localServer = 'Local Server',
}

export interface Location {
  name: string;
  description: string;
  type: LocationType;
  path: string;
}

export interface S3Location extends Location {
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

interface LocationResponse {
  location_id: string;
  name: string;
  description: string;
  s3_config?: S3ConfigResponse;
  fs_config?: FSConfigResponse;
}

export interface LocationListResponse {
  locations: LocationResponse[];
}

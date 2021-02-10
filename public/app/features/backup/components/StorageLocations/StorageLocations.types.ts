export enum LocationType {
  s3 = 'S3',
  localClient = 'Local Client',
  localServer = 'Local Server',
}

export interface Location {
  name: string;
  description: string;
  type: LocationType;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  labels: string[];
}

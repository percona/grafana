import {
  S3Location,
  StorageLocation,
  StorageLocationReponse,
  StorageLocationListReponse,
  LocationType,
} from './StorageLocations.types';

export const isS3Location = (location: StorageLocation | StorageLocationReponse): location is S3Location =>
  's3_config' in location || 'accessKey' in location;

export const formatLocationList = (rawList: StorageLocationListReponse): StorageLocation[] => {
  const { locations } = rawList;
  const parsedLocations: StorageLocation[] = [];

  locations.forEach(location => {
    const { name, description, pmm_server_config, pmm_client_config } = location;
    const newLocation: Partial<StorageLocation> = { name, description };

    if (isS3Location(location)) {
      const { endpoint, access_key, secret_key } = location.s3_config;
      newLocation.type = LocationType.s3;
      newLocation.path = endpoint;
      (newLocation as S3Location).accessKey = access_key;
      (newLocation as S3Location).secretKey = secret_key;
    } else {
      const isServer = pmm_server_config;
      const { path } = isServer ? pmm_server_config : pmm_client_config;
      newLocation.type = isServer ? LocationType.localServer : LocationType.localClient;
      newLocation.path = path;
    }

    parsedLocations.push(newLocation as StorageLocation);
  });
  return parsedLocations;
};

import {
  S3Location,
  StorageLocation,
  StorageLocationListReponse,
  LocationType,
  StorageLocationReponse,
} from './StorageLocations.types';

export const isS3Location = (location: StorageLocation): location is S3Location => 'accessKey' in location;

export const formatLocationList = (rawList: StorageLocationListReponse): StorageLocation[] => {
  const { locations = [] } = rawList;
  const parsedLocations: StorageLocation[] = [];

  locations.forEach(location => {
    const { location_id, name, description, pmm_server_config, pmm_client_config, s3_config } = location;
    const newLocation: Partial<StorageLocation> = { name, description, locationID: location_id };

    if (s3_config) {
      const { endpoint, access_key, secret_key, bucket_name } = s3_config;
      newLocation.type = LocationType.S3;
      newLocation.path = endpoint;
      (newLocation as S3Location).accessKey = access_key;
      (newLocation as S3Location).secretKey = secret_key;
      (newLocation as S3Location).bucketName = bucket_name;
    } else if (pmm_server_config) {
      newLocation.path = pmm_server_config.path;
      newLocation.type = LocationType.SERVER;
    } else if (pmm_client_config) {
      newLocation.path = pmm_client_config.path;
      newLocation.type = LocationType.CLIENT;
    }

    parsedLocations.push(newLocation as StorageLocation);
  });
  return parsedLocations;
};

export const formatToRawLocation = (location: StorageLocation | S3Location): StorageLocationReponse => {
  const { name, description, path, type } = location;
  const localObj = { path };
  const result: Partial<StorageLocationReponse> = { name, description };

  if (isS3Location(location)) {
    const { accessKey, secretKey, bucketName } = location;
    result.s3_config = { endpoint: path, access_key: accessKey, secret_key: secretKey, bucket_name: bucketName };
  } else if (type === LocationType.CLIENT) {
    result.pmm_client_config = localObj;
  } else {
    result.pmm_server_config = localObj;
  }

  return result as StorageLocationReponse;
};

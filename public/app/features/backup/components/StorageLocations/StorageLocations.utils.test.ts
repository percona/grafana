import { LocationType, S3Location, StorageLocation, StorageLocationReponse } from './StorageLocations.types';
import { isS3Location, isS3RawLocation, formatLocationList, formatToRawLocation } from './StorageLocations.utils';

const s3Location: S3Location = {
  name: 's3',
  description: 'description',
  type: LocationType.s3,
  path: 's3://bla',
  secretKey: 'secret',
  accessKey: 'access',
};

const fsLocation: StorageLocation = {
  name: 'client_fs',
  description: 'description',
  type: LocationType.localClient,
  path: '/foo/bar',
};

const rawS3Location: StorageLocationReponse = {
  location_id: 'location_1',
  name: 'first location',
  description: 'description_1',
  s3_config: {
    endpoint: 's3://foo/bar',
    access_key: 'access',
    secret_key: 'secret',
  },
};

const rawFSLocation: StorageLocationReponse = {
  location_id: 'location_2',
  name: 'second location',
  description: 'description_2',
  pmm_server_config: {
    path: '/foo/bar',
  },
};

describe('StorageLocationsUtils', () => {
  it('should infer if location is of S3 type', () => {
    expect(isS3Location(s3Location)).toBeTruthy();
    expect(isS3Location(fsLocation)).toBeFalsy();
    expect(isS3RawLocation(rawS3Location)).toBeTruthy();
    expect(isS3RawLocation(rawFSLocation)).toBeFalsy();
  });

  it('should correctly convert raw format to StorageLocation array', () => {
    const locations = formatLocationList({ locations: [rawS3Location, rawFSLocation] });
    expect(locations).toHaveLength(2);
    expect(locations[0]).toEqual({
      name: rawS3Location.name,
      description: rawS3Location.description,
      type: LocationType.s3,
      path: rawS3Location.s3_config.endpoint,
      accessKey: rawS3Location.s3_config.access_key,
      secretKey: rawS3Location.s3_config.secret_key,
    });
    expect(locations[1]).toEqual({
      name: rawFSLocation.name,
      description: rawFSLocation.description,
      type: LocationType.localServer,
      path: rawFSLocation.pmm_server_config.path,
    });
  });

  it('should correctly convert to raw StorageLocationResponse', () => {
    expect(formatToRawLocation(s3Location)).toEqual({
      name: s3Location.name,
      description: s3Location.description,
      s3_config: {
        endpoint: s3Location.path,
        access_key: s3Location.accessKey,
        secret_key: s3Location.secretKey,
      },
    });

    expect(formatToRawLocation(fsLocation)).toEqual({
      name: fsLocation.name,
      description: fsLocation.description,
      pmm_client_config: {
        path: fsLocation.path,
      },
    });

    expect(formatToRawLocation({ ...fsLocation, type: LocationType.localServer })).toEqual({
      name: fsLocation.name,
      description: fsLocation.description,
      pmm_server_config: {
        path: fsLocation.path,
      },
    });
  });
});

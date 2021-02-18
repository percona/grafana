import { LocationType, S3Location, StorageLocation, StorageLocationReponse } from './StorageLocations.types';
import { isS3Location, formatLocationList } from './StorageLocations.utils';

const s3Location: S3Location = {
  locationID: 'location_1',
  name: 's3',
  description: 'description',
  type: LocationType.S3,
  path: 's3://bla',
  secretKey: 'secret',
  accessKey: 'access',
};

const fsLocation: StorageLocation = {
  locationID: 'location_2',
  name: 'client_fs',
  description: 'description',
  type: LocationType.CLIENT,
  path: '/foo/bar',
};

const rawS3Location: StorageLocationReponse = {
  location_id: 'location_3',
  name: 'first location',
  description: 'description_1',
  s3_config: {
    endpoint: 's3://foo/bar',
    access_key: 'access',
    secret_key: 'secret',
  },
};

const rawFSLocation: StorageLocationReponse = {
  location_id: 'location_4',
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
  });

  it('should correctly convert raw format to StorageLocation array', () => {
    const locations = formatLocationList({ locations: [rawS3Location, rawFSLocation] });
    expect(locations).toHaveLength(2);
    expect(locations[0]).toEqual({
      locationID: rawS3Location.location_id,
      name: rawS3Location.name,
      description: rawS3Location.description,
      type: LocationType.S3,
      path: rawS3Location.s3_config?.endpoint,
      accessKey: rawS3Location.s3_config?.access_key,
      secretKey: rawS3Location.s3_config?.secret_key,
    });
    expect(locations[1]).toEqual({
      locationID: rawFSLocation.location_id,
      name: rawFSLocation.name,
      description: rawFSLocation.description,
      type: LocationType.SERVER,
      path: rawFSLocation.pmm_server_config?.path,
    });
  });
});

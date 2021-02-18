import { LocationType, S3Location, StorageLocation } from '../StorageLocations.types';
import { toFormStorageLocation, toStorageLocation } from './AddStorageLocation.utils';
import { AddStorageLocationFormProps } from './AddStorageLocationModal.types';

describe('AddStorageLocationUtils', () => {
  describe('toFormStorageLocation', () => {
    it('should return an empty S3 object by default', () => {
      expect(toFormStorageLocation(undefined)).toEqual({
        name: '',
        description: '',
        type: LocationType.S3,
        endpoint: '',
        client: '',
        server: '',
        accessKey: '',
        secretKey: '',
      });
    });

    it('should convert an S3Location', () => {
      const location: S3Location = {
        locationID: 'Location_1',
        name: 'S3',
        description: 'S3 location',
        path: 's3://foo',
        type: LocationType.S3,
        accessKey: 'accessKey',
        secretKey: 'secretKey',
      };

      expect(toFormStorageLocation(location)).toEqual({
        name: location.name,
        description: location.description,
        type: LocationType.S3,
        endpoint: location.path,
        accessKey: location.accessKey,
        secretKey: location.secretKey,
      });
    });

    it('should convert a local client location', () => {
      const location: StorageLocation = {
        locationID: 'Location_1',
        name: 'Local Client',
        description: 'Client location',
        path: '/foo/bar',
        type: LocationType.CLIENT,
      };

      expect(toFormStorageLocation(location)).toEqual({
        name: location.name,
        description: location.description,
        type: LocationType.CLIENT,
        client: location.path,
      });
    });

    it('should convert a local server location', () => {
      const location: StorageLocation = {
        locationID: 'Location_1',
        name: 'Local Server',
        description: 'Server location',
        path: '/foo/bar',
        type: LocationType.SERVER,
      };

      expect(toFormStorageLocation(location)).toEqual({
        name: location.name,
        description: location.description,
        type: LocationType.SERVER,
        server: location.path,
      });
    });
  });

  describe('toStorageLocation', () => {
    it('should convert an S3 location', () => {
      const location: AddStorageLocationFormProps = {
        name: 'S3 Location',
        description: 'location',
        type: LocationType.S3,
        endpoint: 's3://foo',
        client: '',
        server: '',
        accessKey: 'accessKey',
        secretKey: 'secretKey',
      };

      expect(toStorageLocation(location)).toEqual({
        name: location.name,
        description: location.description,
        type: LocationType.S3,
        path: location.endpoint,
        accessKey: location.accessKey,
        secretKey: location.secretKey,
      });
    });

    it('should convert a local client location', () => {
      const location: AddStorageLocationFormProps = {
        name: 'Client Location',
        description: 'client',
        type: LocationType.CLIENT,
        endpoint: '',
        client: '/foo/bar',
        server: '',
        accessKey: '',
        secretKey: '',
      };

      expect(toStorageLocation(location)).toEqual({
        name: location.name,
        description: location.description,
        type: LocationType.CLIENT,
        path: location.client,
      });
    });

    it('should convert a local server location', () => {
      const location: AddStorageLocationFormProps = {
        name: 'Server Location',
        description: 'server',
        type: LocationType.SERVER,
        endpoint: '',
        client: '',
        server: '/foo/bar',
        accessKey: '',
        secretKey: '',
      };

      expect(toStorageLocation(location)).toEqual({
        name: location.name,
        description: location.description,
        type: LocationType.SERVER,
        path: location.server,
      });
    });
  });
});

import { InstanceTypes } from '../../panel.types';
import { getInstanceData } from './AddRemoteInstance.tools';

describe('Get instance data:: ', () => {
  it('should return correct one when isRDS is false', () => {
    const instanceType = InstanceTypes.postgresql;
    const credentials = {
      isRDS: false,
      address: 'test address',
      instance_id: 'test instance id',
      port: '5432',
      region: 'us-west1',
      aws_access_key: 'aws-secret-key-example',
      aws_secret_key: 'aws-secret-key-example',
      az: 'test az',
    };
    const testInstance = {
      instanceType: 'PostgreSQL',
      remoteInstanceCredentials: {
        port: '5432',
      },
    };

    expect(getInstanceData(instanceType, credentials)).toEqual(testInstance);
  });

  it('get instance data should return correct one when isRDS is true', () => {
    const instanceType = InstanceTypes.postgresql;
    const credentials = {
      isRDS: true,
      address: 'test address',
      instance_id: 'test instance id',
      port: '5432',
      region: 'us-west1',
      aws_access_key: 'aws-secret-key-example',
      aws_secret_key: 'aws-secret-key-example',
      az: 'test az',
    };
    const testInstance = {
      instanceType: 'PostgreSQL',
      discoverName: 'DISCOVER_RDS_POSTGRESQL',
      remoteInstanceCredentials: {
        isRDS: true,
        address: 'test address',
        instance_id: 'test instance id',
        serviceName: 'test instance id',
        port: '5432',
        region: 'us-west1',
        aws_access_key: 'aws-secret-key-example',
        aws_secret_key: 'aws-secret-key-example',
        az: 'test az',
      },
    };

    expect(getInstanceData(instanceType, credentials)).toEqual(testInstance);
  });

  it('get instance data should return correct data for MongoDB', () => {
    const instanceType = InstanceTypes.mongodb;
    const credentials = {
      isRDS: false,
      address: 'test address',
      instance_id: 'test instance id',
      region: 'us-west1',
      aws_access_key: 'aws-secret-key-example',
      aws_secret_key: 'aws-secret-key-example',
      az: 'test az',
    };
    const testInstance = {
      instanceType: 'MongoDB',
      remoteInstanceCredentials: {
        port: '27017',
      },
    };

    expect(getInstanceData(instanceType, credentials)).toEqual(testInstance);
  });

  it('get instance data should return correct data for MySQL', () => {
    const instanceType = InstanceTypes.mysql;
    const credentials = {
      isRDS: false,
      address: 'test address',
      instance_id: 'test instance id',
      region: 'us-west1',
      aws_access_key: 'aws-secret-key-example',
      aws_secret_key: 'aws-secret-key-example',
      az: 'test az',
    };
    const testInstance = {
      instanceType: 'MySQL',
      remoteInstanceCredentials: {
        port: '3306',
      },
    };

    expect(getInstanceData(instanceType, credentials)).toEqual(testInstance);
  });

  it('get instance data should return correct data for ProxySQL', () => {
    const instanceType = InstanceTypes.proxysql;
    const credentials = {
      isRDS: false,
      address: 'test address',
      instance_id: 'test instance id',
      region: 'us-west1',
      aws_access_key: 'aws-secret-key-example',
      aws_secret_key: 'aws-secret-key-example',
      az: 'test az',
    };
    const testInstance = {
      instanceType: 'ProxySQL',
      remoteInstanceCredentials: {
        port: '6032',
      },
    };

    expect(getInstanceData(instanceType, credentials)).toEqual(testInstance);
  });
});

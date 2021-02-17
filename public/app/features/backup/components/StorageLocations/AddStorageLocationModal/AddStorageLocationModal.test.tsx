import React from 'react';
import { mount } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { LocationType, S3Location, StorageLocation } from '../StorageLocations.types';
import { LocalFields } from './LocalFields';
import { S3Fields } from './S3Fields';
import { AddStorageLocationModal } from './AddStorageLocationModal';

describe('AddStorageLocationModal', () => {
  it('should render local TypeField', () => {
    const location: StorageLocation = {
      name: 'client_fs',
      description: 'description',
      type: LocationType.CLIENT,
      path: '/foo/bar',
    };
    const wrapper = mount(
      <AddStorageLocationModal location={location} onClose={jest.fn()} onAdd={jest.fn()} isVisible />
    );

    expect(wrapper.find(LocalFields).exists()).toBeTruthy();
    expect(wrapper.find(LocalFields).prop('name')).toBe('client');
  });

  it('should render S3 TypeField', () => {
    const location: S3Location = {
      name: 'client_fs',
      description: 'description',
      type: LocationType.S3,
      path: '/foo/bar',
      accessKey: 'accessKey',
      secretKey: 'secretKey',
    };
    const wrapper = mount(
      <AddStorageLocationModal location={location} onClose={jest.fn()} onAdd={jest.fn()} isVisible />
    );

    expect(wrapper.find(S3Fields).exists()).toBeTruthy();
    expect(wrapper.find(S3Fields).prop('endpoint')).toBe('/foo/bar');
  });

  it('should call onAdd callback', () => {
    const onAdd = jest.fn();
    const location: S3Location = {
      name: 'client_fs',
      description: 'description',
      type: LocationType.S3,
      path: '/foo/bar',
      accessKey: 'accessKey',
      secretKey: 'secretKey',
    };
    const wrapper = mount(<AddStorageLocationModal location={location} onClose={jest.fn()} onAdd={onAdd} isVisible />);
    wrapper.find(dataQa('endpoint-text-input')).simulate('change', { target: { value: 's3://foo' } });
    wrapper.find('form').simulate('submit');

    expect(onAdd).toHaveBeenCalled();
  });
});

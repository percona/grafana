import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { act } from 'react-dom/test-utils';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { StorageLocations } from './StorageLocations';
import { AddStorageLocationModal } from './AddStorageLocationModal';

const stubResponseArray = ['this is stubbed'];
jest.mock('./StorageLocations.service');
jest.mock('./StorageLocations.utils', () => ({
  formatLocationList: () => stubResponseArray,
}));

describe('StorageLocations', () => {
  it('should render table with data', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = await mount(<StorageLocations />);
    });
    wrapper.update();

    expect(wrapper.find(Table).prop('data')).toEqual(stubResponseArray);
  });

  it('should open the modal by clicking the "Add" button', () => {
    const wrapper = shallow(<StorageLocations />);

    expect(wrapper.find(AddStorageLocationModal).prop('isVisible')).toBeFalsy();
    wrapper.find(dataQa('storage-location-add-modal-button')).simulate('click');
    expect(wrapper.find(AddStorageLocationModal).prop('isVisible')).toBeTruthy();
  });
});

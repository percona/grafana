import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { StorageLocations } from './StorageLocations';

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
});

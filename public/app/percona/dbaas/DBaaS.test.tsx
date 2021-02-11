import React from 'react';
import { mount } from 'enzyme';
import { useSelector } from 'react-redux';
import { getLocationSrv } from '@grafana/runtime';
import { DBaaS } from './DBaaS';

jest.mock('app/core/app_events');
jest.mock('./components/Kubernetes/Kubernetes.hooks');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const fakeLocationUpdate = jest.fn();

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getLocationSrv: jest.fn().mockImplementation(() => ({ update: fakeLocationUpdate })),
}));

describe('DBaaS::', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation(callback => {
      return callback({ location: { routeParams: { tab: 'kubernetes' }, path: '/dbaas/kubernetes' } });
    });
  });
  afterEach(() => {
    (useSelector as jest.Mock).mockClear();
    (getLocationSrv as jest.Mock).mockClear();
    fakeLocationUpdate.mockClear();
  });
  it('renders tabs correctly', () => {
    const root = mount(<DBaaS />);
    const tabs = root.find('ul');

    expect(tabs.children().length).toBe(2);
  });
});

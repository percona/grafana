import React from 'react';
import { mount } from 'enzyme';
import { KubernetesInventory } from './KubernetesInventory';
import { kubernetesStub } from './__mocks__/kubernetesStubs';
import { useSelector } from 'react-redux';

jest.mock('app/core/app_events');
jest.mock('./Kubernetes.hooks');
jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux');
  return {
    ...original,
    useSelector: jest.fn(),
  };
});

describe('KubernetesInventory::', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((callback) => {
      return callback({ perconaUser: { isAuthorized: true }, perconaSettings: { isLoading: false } });
    });
  });

  it('renders table correctly', () => {
    const root = mount(<KubernetesInventory />);
    const rows = root.find('tr');
    expect(rows.length).toBe(kubernetesStub.length + 1);
  });
});

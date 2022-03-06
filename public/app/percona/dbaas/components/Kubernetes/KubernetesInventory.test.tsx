import React from 'react';
import { mount } from 'enzyme';
import { KubernetesInventory } from './KubernetesInventory';
import { kubernetesStub } from './__mocks__/kubernetesStubs';

jest.mock('app/core/app_events');
jest.mock('./Kubernetes.hooks');

describe('KubernetesInventory::', () => {
  it('renders table correctly', () => {
    const root = mount(<KubernetesInventory />);
    const rows = root.find('tr');

    expect(rows.length).toBe(kubernetesStub.length + 1);
  });
});

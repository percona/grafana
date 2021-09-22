import { mount } from 'enzyme';
import React from 'react';
import { dataTestId } from '@percona/platform-core';
import AddRemoteInstance from './AddRemoteInstance';

xdescribe('Add remote instance:: ', () => {
  it('should render correct for mysql and highlight empty mandatory fields on submit', async () => {
    const type = 'mysql';

    const root = mount(<AddRemoteInstance instance={{ type, credentials: {} }} selectInstance={jest.fn()} />);

    expect(root.find('input[data-testid="address-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="username-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="password-password-input"].invalid').length).toBe(0);

    root.find(dataTestId('add-remote-instance-form')).simulate('submit');

    expect(root.find('input[data-testid="address-text-input"].invalid').length).toBe(1);
    expect(root.find('input[data-testid="username-text-input"].invalid').length).toBe(1);
    expect(root.find('input[data-testid="password-password-input"].invalid').length).toBe(1);
  });

  it('should render for external service and highlight empty mandatory fields on submit', () => {
    const type = 'external';

    const root = mount(<AddRemoteInstance instance={{ type, credentials: {} }} selectInstance={jest.fn()} />);

    expect(root.find('input[data-testid="address-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="metrics_path-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="port-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="username-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="password-password-input"].invalid').length).toBe(0);

    root.find(dataTestId('add-remote-instance-form')).simulate('submit');

    expect(root.find('input[data-testid="address-text-input"].invalid').length).toBe(1);
    expect(root.find('input[data-testid="metrics_path-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="port-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="username-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="password-password-input"].invalid').length).toBe(0);
  });

  it('should render correct for HAProxy and highlight empty mandatory fields on submit', async () => {
    const type = 'haproxy';

    const root = mount(<AddRemoteInstance instance={{ type, credentials: {} }} selectInstance={jest.fn()} />);

    expect(root.find('input[data-testid="address-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="username-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="password-password-input"].invalid').length).toBe(0);

    root.find(dataTestId('add-remote-instance-form')).simulate('submit');

    expect(root.find('input[data-testid="address-text-input"].invalid').length).toBe(1);
    expect(root.find('input[data-testid="username-text-input"].invalid').length).toBe(0);
    expect(root.find('input[data-testid="password-password-input"].invalid').length).toBe(0);
  });
});

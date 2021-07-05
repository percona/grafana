import React from 'react';
import { mount } from 'enzyme';
import { OperatorStatusItem } from './OperatorStatusItem';
import { Databases } from 'app/percona/shared/core';
import { KubernetesOperatorStatus } from './KubernetesOperatorStatus/KubernetesOperatorStatus.types';

describe('OperatorStatusItem::', () => {
  it('renders', () => {
    const root = mount(
      <OperatorStatusItem databaseType={Databases.mysql} operator={{ status: KubernetesOperatorStatus.ok }} />
    );

    expect(root.text()).toContain('PXC');
    expect(root.text()).toContain('Installed');
    expect(root.text()).not.toContain('1.8.0');
  });
  it('renders with operator version', () => {
    const operator = { status: KubernetesOperatorStatus.ok, version: '1.8.0' };
    const root = mount(<OperatorStatusItem databaseType={Databases.mysql} operator={operator} />);

    expect(root.text()).toContain('PXC');
    expect(root.text()).toContain('Installed');
    expect(root.text()).toContain('1.8.0');
  });
});

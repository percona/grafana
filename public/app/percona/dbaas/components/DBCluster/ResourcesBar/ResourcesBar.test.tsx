import React from 'react';
import { mount } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { ResourcesBar } from './ResourcesBar';
import { Messages } from './ResourcesBar.messages';

describe('ResourcesBar::', () => {
  it('renders correctly with icon, allocated, expected and label', () => {
    const allocated = 2;
    const total = 10;
    const expected = 2;
    const resourceLabel = 'Memory';
    const wrapper = mount(
      <ResourcesBar
        icon={<div>Test icon</div>}
        allocated={allocated}
        expected={expected}
        total={total}
        resourceLabel={resourceLabel}
      />
    );

    expect(wrapper.find(dataQa('resources-bar-icon')).text()).toEqual('Test icon');
    expect(wrapper.find(dataQa('resources-bar-label')).text()).toEqual(Messages.buildResourcesLabel(allocated, total));
    expect(wrapper.find(dataQa('resources-bar-allocated-caption')).text()).toEqual(
      Messages.buildAllocatedLabel(allocated, resourceLabel)
    );
    expect(wrapper.find(dataQa('resources-bar-expected-caption')).text()).toEqual(
      Messages.buildExpectedLabel(expected, resourceLabel)
    );
  });
  it('renders invalid message for insufficient resources', () => {
    const allocated = 2;
    const total = 10;
    const expected = 20;
    const resourceLabel = 'Memory';
    const wrapper = mount(
      <ResourcesBar allocated={allocated} expected={expected} total={total} resourceLabel={resourceLabel} />
    );

    expect(wrapper.find(dataQa('resources-bar-insufficient-resources')).text()).toEqual(
      Messages.buildInsufficientLabel(resourceLabel)
    );
  });
});

import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Tab, TabContent } from '@grafana/ui';
import { IntegratedAlertingTabs } from './IntegratedAlertingTabs';

describe('IntegratedAlertingTabs', () => {
  it('should show all tabs', async () => {
    let wrapper: ShallowWrapper;

    await act(async () => {
      wrapper = await shallow(<IntegratedAlertingTabs />);
    });

    expect(wrapper.find(Tab)).toHaveLength(4);
    expect(wrapper.find(TabContent).exists()).toBeTruthy();
  });
});

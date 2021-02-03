import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import IntegratedAlertingPage from './IntegratedAlertingPage';
import { Messages } from './IntegratedAlerting.messages';

jest.mock('./components/Alerts/Alerts.service');

describe('IntegratedAlertingPage', () => {
  it('should render component correctly', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = await mount(<IntegratedAlertingPage />);
    });
    const tabs = wrapper.find('ul');

    expect(tabs.children().length).toBe(4);
    expect(
      tabs
        .find('li')
        .at(0)
        .text()
    ).toEqual(Messages.tabs.alerts);
  });
});

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import IntegratedAlertingPage from './IntegratedAlertingPage';
import { Messages } from './IntegratedAlerting.messages';
import { IntegratedAlertingService } from './IntegratedAlerting.service';
import { dataQa } from '@percona/platform-core';

jest.mock('./IntegratedAlerting.service');
jest.mock('./components/Alerts/Alerts.service');

describe('IntegratedAlertingPage', () => {
  let wrapper: any;
  it('should display empty block if IA is disabled', async () => {
    await act(async () => {
      wrapper = await mount(<IntegratedAlertingPage />);
    });
    expect(wrapper.find(dataQa('ia-empty-block')).exists()).toBeTruthy();
  });

  it('should render component correctly when IA is enabled', async () => {
    let wrapper: ReactWrapper;
    jest
      .spyOn(IntegratedAlertingService, 'getSettings')
      .mockImplementationOnce(() => Promise.resolve({ settings: { alerting_enabled: true } }));

    await act(async () => {
      wrapper = await mount(<IntegratedAlertingPage />);
    });
    wrapper.update();
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

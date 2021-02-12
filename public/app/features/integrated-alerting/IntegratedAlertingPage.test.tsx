import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, ShallowWrapper } from 'enzyme';
import IntegratedAlertingPage from './IntegratedAlertingPage';
import { IntegratedAlertingContent } from './components/IntegratedAlertingContent';

jest.mock('./IntegratedAlerting.service');
jest.mock('./components/Alerts/Alerts.service');

describe('IntegratedAlertingPage', () => {
  let wrapper: ShallowWrapper;
  it('should output IntegratedAlertingContent', async () => {
    await act(async () => {
      wrapper = await shallow(<IntegratedAlertingPage />);
    });
    expect(wrapper.find(IntegratedAlertingContent).exists()).toBeTruthy();
  });
});

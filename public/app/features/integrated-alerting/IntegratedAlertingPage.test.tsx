import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
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

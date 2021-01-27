import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { dataQa } from '@percona/platform-core';
import { AddNotificationChannelModal } from './AddNotificationChannelModal';
import { TYPE_OPTIONS } from './AddNotificationChannel.constants';
import { notificationChannelStubs } from '../__mocks__/notificationChannelStubs';
import { NotificationChannelType, PagerDutylNotificationChannel } from '../NotificationChannel.types';

jest.mock('../NotificationChannel.service');
jest.mock('app/core/app_events');

const findFormButton = (wrapper: ReactWrapper) =>
  wrapper.find(dataQa('notification-channel-add-button')).find('button');

describe('AddNotificationChannelModal', () => {
  it('should render modal with correct fields', () => {
    const wrapper = mount(<AddNotificationChannelModal setVisible={jest.fn()} isVisible />);

    expect(wrapper.find('[className$="-singleValue"]').text()).toEqual(TYPE_OPTIONS[0].label);
    expect(wrapper.find('input').length).toBe(2);
    expect(wrapper.find(dataQa('emails-textarea-input')).length).toBe(1);
    expect(wrapper.find(dataQa('notification-channel-add-button')).find('button').length).toBe(1);
    expect(wrapper.find(dataQa('notification-channel-cancel-button')).find('button').length).toBe(1);
  });

  it('should not render modal when visible is set to false', () => {
    const wrapper = mount(<AddNotificationChannelModal setVisible={jest.fn()} isVisible={false} />);

    expect(wrapper.find(dataQa('emails-textarea-input')).length).toBe(0);
  });

  it('should call setVisible on close', () => {
    const setVisible = jest.fn();
    const wrapper = mount(<AddNotificationChannelModal setVisible={setVisible} isVisible />);

    wrapper.find(dataQa('modal-background')).simulate('click');

    expect(setVisible).toHaveBeenCalled();
  });

  it('should call setVisible on submit', async () => {
    const setVisible = jest.fn();
    const wrapper = mount(<AddNotificationChannelModal setVisible={setVisible} isVisible />);

    wrapper.find(dataQa('name-text-input')).simulate('change', { target: { value: 'Email test' } });
    wrapper.find('textarea').simulate('change', { target: { value: 'test1@percona.com' } });

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });

    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it('should render with notification channel', async () => {
    const setVisible = jest.fn();
    const wrapper = mount(
      <AddNotificationChannelModal
        notificationChannel={notificationChannelStubs[0]}
        setVisible={setVisible}
        isVisible
      />
    );

    expect(wrapper.find(dataQa('name-text-input')).prop('value')).toEqual(notificationChannelStubs[0].summary);
  });

  it('should have the submit button initially disabled', () => {
    const wrapper = mount(<AddNotificationChannelModal setVisible={jest.fn()} isVisible />);
    const button = findFormButton(wrapper);

    expect(button.props().disabled).toBeTruthy();
  });

  describe('Pager Duty option', () => {
    const ORIGINAL_ROUTING_KEY = 'example_key';
    const CHANGED_ROUTING_KEY = 'changed_key';
    const channel: PagerDutylNotificationChannel = {
      type: NotificationChannelType.pagerDuty,
      channelId: '',
      summary: '',
      disabled: false,
      sendResolved: false,
      routingKey: ORIGINAL_ROUTING_KEY,
      serviceKey: '',
    };

    it('should reset service/routing keys when radios are clicked', () => {
      const wrapper = mount(
        <AddNotificationChannelModal setVisible={jest.fn()} isVisible notificationChannel={channel} />
      );

      const keyTypeRadioButtons = wrapper.find(dataQa('keyType-radio-button'));
      const routingKeyTypeButton = keyTypeRadioButtons.first();
      const serviceKeyTypeButton = keyTypeRadioButtons.at(1);
      let routingKeyInput = wrapper.find(dataQa('routing-text-input'));

      expect(routingKeyInput.props().value).toBe(ORIGINAL_ROUTING_KEY);
      routingKeyInput.props().value = CHANGED_ROUTING_KEY;
      expect(routingKeyInput.props().value).toBe(CHANGED_ROUTING_KEY);
      serviceKeyTypeButton.simulate('input');
      routingKeyTypeButton.simulate('input');
      routingKeyInput = wrapper.find(dataQa('routing-text-input'));
      expect(routingKeyInput.props().value).toBe(ORIGINAL_ROUTING_KEY);
    });
  });
});

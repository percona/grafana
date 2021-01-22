import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { dataQa } from '@percona/platform-core';
import { AddNotificationChannelModal } from './AddNotificationChannelModal';
import { TYPE_OPTIONS } from './AddNotificationChannel.constants';
import { NotificationChannelType } from '../NotificationChannel.types';
import { notificationChannelStubs } from '../__mocks__/notificationChannelStubs';

jest.mock('../NotificationChannel.service');
jest.mock('app/core/app_events');

/**
 * Return this form's "Add" button
 */
const findFormButton = (wrapper: ReactWrapper) =>
  wrapper.find(dataQa('notification-channel-add-button')).find('button');

/**
 * Given a type, return the matching element.
 * The element returned is the one that's actually clickable and that triggers the change
 */
const findTypeOption = (wrapper: ReactWrapper, type: NotificationChannelType): ReactWrapper => {
  const menuOptions = wrapper.find({ 'aria-label': 'Select option' });
  const matchingOption = TYPE_OPTIONS.find(option => option.value === type);

  return menuOptions.filterWhere(node => node.text() === matchingOption.label);
};

/**
 * Fill the form with a name and a notification channel type
 */
const fillNameAndType = (wrapper: ReactWrapper, type: NotificationChannelType, name = 'John Doe') => {
  const inputs = wrapper.find('input');
  const nameInput = inputs.at(0);
  const typeInput = inputs.at(1);

  nameInput.simulate('change', {
    target: {
      value: name,
    },
  });

  typeInput.simulate('keydown', {
    key: 'ArrowDown',
  });

  const option = findTypeOption(wrapper, type);

  option.simulate('click');
};

fdescribe('AddNotificationChannelModal', () => {
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
    it('should have the submit button disabled if both routing and service keys are empty', () => {
      const wrapper = mount(<AddNotificationChannelModal setVisible={jest.fn()} isVisible />);

      fillNameAndType(wrapper, NotificationChannelType.pagerDuty);

      const button = findFormButton(wrapper);
      expect(button.props().disabled).toBeTruthy();
    });

    it('should enable submit button if only routing key is provided', () => {
      const wrapper = mount(<AddNotificationChannelModal setVisible={jest.fn()} isVisible />);
      fillNameAndType(wrapper, NotificationChannelType.pagerDuty);

      const routingKeyInput = wrapper.find(dataQa('routing-text-input')).at(0);
      routingKeyInput.simulate('change', { target: { value: 'Sample routing key' } });

      const button = findFormButton(wrapper);
      expect(button.props().disabled).toBeFalsy();
    });

    it('should enable submit button if only service key is provided', () => {
      const wrapper = mount(<AddNotificationChannelModal setVisible={jest.fn()} isVisible />);
      fillNameAndType(wrapper, NotificationChannelType.pagerDuty);

      const serviceKeyInput = wrapper.find(dataQa('service-text-input')).at(0);
      serviceKeyInput.simulate('change', { target: { value: 'Sample service key' } });

      const button = findFormButton(wrapper);
      expect(button.props().disabled).toBeFalsy();
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { SecretToggler } from './SecretToggler';
import { Icon } from '@grafana/ui';

describe('SecretToggler', () => {
  it('should render hidden characters by default', () => {
    const wrapper = shallow(<SecretToggler secret="secret" />);

    expect(wrapper.find('input').prop('type')).toBe('password');
  });

  it('should show the unlock icon when not showing text', () => {
    const wrapper = shallow(<SecretToggler secret="secret" />);

    expect(wrapper.find(Icon).prop('name')).toBe('unlock');
  });

  it('should reveal the secret when the lock is clicked', () => {
    const wrapper = shallow(<SecretToggler secret="secret" />);

    wrapper.find(Icon).simulate('click');
    expect(wrapper.find(Icon).prop('name')).toBe('lock');
    expect(wrapper.find('input').prop('type')).toBe('text');
  });

  it('should have the input as read only by default', () => {
    const wrapper = shallow(<SecretToggler secret="secret" />);

    expect(wrapper.find('input').prop('readOnly')).toBeTruthy();
  });
});

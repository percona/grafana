import React from 'react';
import { mount } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { SignIn } from './SignIn';

jest.mock('../PlatformLogin.service.ts');

describe('SignIn::', () => {
  it('has a "Forgot password" link', () => {
    const wrapper = mount(<SignIn changeMode={jest.fn()} getSettings={jest.fn()} />);
    const forgotPasswordButton = wrapper.find(dataQa('sign-in-forgot-password-button')).first();

    expect(forgotPasswordButton).not.toBeNull();
  });

  it('switches to sign up when clicking on the "go to sign up" button', () => {
    const fakeChangeMode = jest.fn();

    const wrapper = mount(<SignIn changeMode={fakeChangeMode} getSettings={jest.fn()} />);
    const switchToSignUpButton = wrapper.find(dataQa('sign-in-to-sign-up-button')).first();

    switchToSignUpButton.simulate('click');

    expect(fakeChangeMode).toBeCalledTimes(1);
  });
});

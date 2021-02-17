import React from 'react';
import { shallow } from 'enzyme';
import { TextInputField } from '@percona/platform-core';
import { S3Fields } from './S3Fields';
import { SecretToggler } from '../../../SecretToggler';

describe('S3Fields', () => {
  it('should pass initial values', () => {
    const wrapper = shallow(<S3Fields endpoint="/foo" accessKey="accessKey" secretKey="secretKey" />);

    expect(
      wrapper
        .find(TextInputField)
        .first()
        .prop('initialValue')
    ).toBe('/foo');
    expect(
      wrapper
        .find(TextInputField)
        .last()
        .prop('initialValue')
    ).toBe('accessKey');
    expect(
      wrapper
        .find(SecretToggler)
        .last()
        .prop('secret')
    ).toBe('secretKey');
  });
});

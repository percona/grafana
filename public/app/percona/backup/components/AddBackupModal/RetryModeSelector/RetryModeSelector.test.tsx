import React from 'react';
import { RetryModeSelector } from './RetryModeSelector';
import { NumberInputField, RadioButtonGroupField } from '@percona/platform-core';
import { RetryMode } from 'app/percona/backup/Backup.types';
import { getFormWrapper } from 'app/percona/shared/helpers/testUtils';

describe('RetryModeSelector', () => {
  it('should render', () => {
    const wrapper = getFormWrapper(<RetryModeSelector retryMode={RetryMode.MANUAL} />);
    expect(wrapper.find(RadioButtonGroupField)).toHaveLength(1);
    expect(wrapper.find(NumberInputField)).toHaveLength(2);
    expect(
      wrapper
        .find(NumberInputField)
        .at(0)
        .prop('disabled')
    ).toBeFalsy();
  });
});

it('should disable number inputs when retry mode is AUTO', () => {
  const wrapper = getFormWrapper(<RetryModeSelector retryMode={RetryMode.AUTO} />);
  expect(
    wrapper
      .find(NumberInputField)
      .at(0)
      .prop('disabled')
  ).toBeTruthy();
});

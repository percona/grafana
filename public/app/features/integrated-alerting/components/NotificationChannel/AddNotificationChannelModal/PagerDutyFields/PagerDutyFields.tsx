import React, { FC } from 'react';
import { RadioButtonGroupField, TextInputField, validators } from '@percona/platform-core';
import { Messages } from '../AddNotificationChannelModal.messages';
import { PagerDutyFieldsProps } from './PagerDutyFields.types';
import { PagerDutyKeyType } from '../../NotificationChannel.types';
import { PAGER_DUTY_TYPE_OPTIONS } from '../AddNotificationChannel.constants';

const { required } = validators;
const keyValidator = [required];

export const PagerDutyFields: FC<PagerDutyFieldsProps> = ({ values, mutators }) => {
  return (
    <>
      <RadioButtonGroupField
        inputProps={{
          onInput: () => {
            values.keyType === PagerDutyKeyType.routing
              ? mutators.resetKey(PagerDutyKeyType.service)
              : mutators.resetKey(PagerDutyKeyType.routing);
          },
        }}
        name="keyType"
        options={PAGER_DUTY_TYPE_OPTIONS}
        fullWidth
      />
      {values.keyType === PagerDutyKeyType.routing ? (
        <TextInputField name={PagerDutyKeyType.routing} label={Messages.fields.routingKey} validators={keyValidator} />
      ) : (
        <TextInputField name={PagerDutyKeyType.service} label={Messages.fields.serviceKey} validators={keyValidator} />
      )}
    </>
  );
};

import React, { FC } from 'react';
import { RadioButtonGroupField, TextInputField, validators } from '@percona/platform-core';
import { Messages } from '../AddNotificationChannelModal.messages';
import { PagerDutyFieldsProps } from './PagerDutyFields.types';
import { PagerDutyKeyType } from '../../NotificationChannel.types';
import { PAGER_DUTY_TYPE_OPTIONS } from '../AddNotificationChannel.constants';

const { required } = validators;
const keyValidator = [required];

export const PagerDutyFields: FC<PagerDutyFieldsProps> = ({ values }) => {
  return (
    <>
      <RadioButtonGroupField name="keyType" options={PAGER_DUTY_TYPE_OPTIONS} fullWidth />
      {values.keyType === PagerDutyKeyType.routing ? (
        <TextInputField name="routingKey" value="" label={Messages.fields.routingKey} validators={keyValidator} />
      ) : (
        <TextInputField name="serviceKey" value="" label={Messages.fields.serviceKey} validators={keyValidator} />
      )}
    </>
  );
};

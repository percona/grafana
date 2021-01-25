import React, { FC } from 'react';
import { RadioButtonGroupField, TextInputField } from '@percona/platform-core';
import { Messages } from '../AddNotificationChannelModal.messages';
import { PagerDutyFieldsProps } from './PagerDutyFields.types';
import { PagerDutyKeyType } from '../../NotificationChannel.types';
import { PAGER_DUTY_TYPE_OPTIONS } from '../AddNotificationChannel.constants';

export const PagerDutyFields: FC<PagerDutyFieldsProps> = ({ values }) => {
  return (
    <>
      <RadioButtonGroupField name="keyType" options={PAGER_DUTY_TYPE_OPTIONS} fullWidth />
      {values.keyType === PagerDutyKeyType.routing ? (
        <TextInputField name="routing-key" label={Messages.fields.routingKey} />
      ) : (
        <TextInputField name="service-key" label={Messages.fields.serviceKey} />
      )}
    </>
  );
};

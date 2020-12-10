import React, { FC } from 'react';
import { TextInputField, validators } from '@percona/platform-core';
import { Messages } from '../AddNotificationChannelModal.messages';

export const PagerDutyFields: FC = () => {
  const { required } = validators;

  return (
    <>
      <TextInputField name="routing" label={Messages.fields.routingKey} validators={[required]} />
      <TextInputField name="service" label={Messages.fields.serviceKey} validators={[required]} />
    </>
  );
};

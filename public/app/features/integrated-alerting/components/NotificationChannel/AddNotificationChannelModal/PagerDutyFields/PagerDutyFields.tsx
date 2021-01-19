import React, { FC } from 'react';
import { TextInputField } from '@percona/platform-core';
import { Messages } from '../AddNotificationChannelModal.messages';
import { PagerDutyFieldsProps } from './PagerDutyFields.types';

/**
 * This is a validator factory.
 * Given a key, return a validator that will check if there's anything there.
 */
const anotherKeyRequired = (complementaryKey: string) => (value: any, allValues: any): undefined | string => {
  if (allValues[complementaryKey]) {
    /**
     * The complementary field is there, we're good to go without errors
     */
    return undefined;
  }

  /**
   * The complementary field is missing, we must check if this field is empty before signalling an error
   */
  return value ? undefined : Messages.routingOrServiceKeyRequired;
};

export const PagerDutyFields: FC<PagerDutyFieldsProps> = () => {
  return (
    <>
      <TextInputField name="routing" label={Messages.fields.routingKey} validators={[anotherKeyRequired('service')]} />
      <TextInputField name="service" label={Messages.fields.serviceKey} validators={[anotherKeyRequired('routing')]} />
    </>
  );
};

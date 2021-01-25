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
          /**
           * TODO We are relying on "onInput" being called after the form's state values are update.
           * It works this way, but we should change platform-core to allow to pass values to the options.
           * That way, we can take the value from the event itself here and call the mutator.
           * Also, it then becomes easier to test this interaction.
           */
          onInput: () => {
            values?.keyType === PagerDutyKeyType.service
              ? mutators?.resetKey(PagerDutyKeyType.routing)
              : mutators?.resetKey(PagerDutyKeyType.service);
          },
        }}
        name="keyType"
        options={PAGER_DUTY_TYPE_OPTIONS}
        initialValue={values?.keyType || PAGER_DUTY_TYPE_OPTIONS[0].value}
        fullWidth
      />
      {values.keyType === PagerDutyKeyType.service ? (
        <TextInputField name={PagerDutyKeyType.service} label={Messages.fields.serviceKey} validators={keyValidator} />
      ) : (
        <TextInputField name={PagerDutyKeyType.routing} label={Messages.fields.routingKey} validators={keyValidator} />
      )}
    </>
  );
};

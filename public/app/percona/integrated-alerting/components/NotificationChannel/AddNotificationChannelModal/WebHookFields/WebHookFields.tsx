import React, { FC } from 'react';
import { RadioButtonGroupField, TextareaInputField, TextInputField, validators } from '@percona/platform-core';
import { validators as customValidators } from 'app/percona/shared/helpers/validators';
import { WebHookAuthType } from '../../NotificationChannel.types';
import { WEBHOOK_TYPE_OPTIONS } from '../AddNotificationChannel.constants';
import { Messages } from '../AddNotificationChannelModal.messages';
import { WebHookBasicFields } from './WebHookBasicFields/WebHookBasicFields';
import { WebHookFieldsProps } from './WebHookFields.types';
import { WebHookTokenFields } from './WebHookTokenFields/WebHookTokenFields';

export const WebHookFields: FC<WebHookFieldsProps> = ({ values }) => {
  return (
    <>
      <TextInputField
        name="url"
        label={Messages.fields.url}
        validators={[validators.required, customValidators.validateUrl]}
      />
      <RadioButtonGroupField
        fullWidth
        name="webHookType"
        options={WEBHOOK_TYPE_OPTIONS}
        initialValue={values.webHookType || WEBHOOK_TYPE_OPTIONS[0].value}
        label={Messages.fields.authType}
      />
      {values.webHookType === WebHookAuthType.basic && <WebHookBasicFields />}
      {values.webHookType === WebHookAuthType.token && <WebHookTokenFields />}
      <TextareaInputField name="ca" label={Messages.fields.ca} validators={[validators.required]} />
      <TextareaInputField name="cert" label={Messages.fields.certificate} validators={[validators.required]} />
      <TextareaInputField name="key" label={Messages.fields.certKey} validators={[validators.required]} />
      <TextInputField name="serverName" label={Messages.fields.serverName} validators={[validators.required]} />
    </>
  );
};

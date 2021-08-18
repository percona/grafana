import { RadioButtonGroupField, TextareaInputField, TextInputField } from '@percona/platform-core';
import React, { FC } from 'react';
import { WebHookAuthType } from '../../NotificationChannel.types';
import { WEBHOOK_TYPE_OPTIONS } from '../AddNotificationChannel.constants';
import { Messages } from '../AddNotificationChannelModal.messages';
import { WebHookBasicFields } from './WebHookBasicFields/WebHookBasicFields';
import { WebHookFieldsProps } from './WebHookFields.types';
import { WebHookTokenFields } from './WebHookTokenFields/WebHookTokenFields';

export const WebHookFields: FC<WebHookFieldsProps> = ({ values }) => {
  return (
    <>
      <TextInputField name="url" label={Messages.fields.url} />
      <RadioButtonGroupField
        fullWidth
        name="webHookType"
        options={WEBHOOK_TYPE_OPTIONS}
        initialValue={values.webHookType || WEBHOOK_TYPE_OPTIONS[0].value}
        label={Messages.fields.authType}
      />
      {values.webHookType === WebHookAuthType.basic && <WebHookBasicFields />}
      {values.webHookType === WebHookAuthType.token && <WebHookTokenFields />}
      <TextareaInputField name="ca" label={Messages.fields.ca} />
      <TextareaInputField name="cert" label={Messages.fields.certificate} />
      <TextareaInputField name="key" label={Messages.fields.certKey} />
      <TextInputField name="serverName" label={Messages.fields.serverName} />
    </>
  );
};

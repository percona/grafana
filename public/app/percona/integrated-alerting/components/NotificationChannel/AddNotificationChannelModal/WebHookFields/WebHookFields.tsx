import { RadioButtonGroupField, TextareaInputField, TextInputField } from '@percona/platform-core';
import React, { FC } from 'react';
import { WebHookAuthType } from '../../NotificationChannel.types';
import { WEBHOOK_TYPE_OPTIONS } from '../AddNotificationChannel.constants';
import { WebHookBasicFields } from './WebHookBasicFields/WebHookBasicFields';
import { WebHookFieldsProps } from './WebHookFields.types';
import { WebHookTokenFields } from './WebHookTokenFields/WebHookTokenFields';

export const WebHookFields: FC<WebHookFieldsProps> = ({ values }) => {
  return (
    <>
      <TextInputField name="url" label="Url" />
      <RadioButtonGroupField
        fullWidth
        name="webHookType"
        options={WEBHOOK_TYPE_OPTIONS}
        initialValue={values.webHookType || WEBHOOK_TYPE_OPTIONS[0].value}
      />
      {values.webHookType === WebHookAuthType.basic && <WebHookBasicFields />}
      {values.webHookType === WebHookAuthType.token && <WebHookTokenFields />}
      <TextareaInputField name="ca" label="Certificate Authority" />
      <TextareaInputField name="cert" label="Certificate" />
      <TextareaInputField name="key" label="Certificate Key" />
      <TextInputField name="serverName" label="Server Name" />
    </>
  );
};

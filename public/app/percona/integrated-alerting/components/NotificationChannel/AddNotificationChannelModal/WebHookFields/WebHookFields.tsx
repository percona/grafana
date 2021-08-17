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
      <RadioButtonGroupField name="webHookType" options={WEBHOOK_TYPE_OPTIONS} />
      {values.webHookType === WebHookAuthType.basic && <WebHookBasicFields />}
      {values.webHookType === WebHookAuthType.token && <WebHookTokenFields />}
      <TextareaInputField name="ca" />
      <TextareaInputField name="cert" />
      <TextareaInputField name="key" />
      <TextInputField name="serverName" />
      <TextInputField name="serverName" />
    </>
  );
};

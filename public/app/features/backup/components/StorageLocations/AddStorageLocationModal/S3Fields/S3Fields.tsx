import React, { FC } from 'react';
import { TextInputField, validators } from '@percona/platform-core';
import { S3FieldsProps } from './S3Fields.types';
import { Messages } from './S3Fields.Messages';

export const S3Fields: FC<S3FieldsProps> = () => (
  <>
    <TextInputField name="path" label={Messages.endpoint} validators={[validators.required]} />
    <TextInputField name="accessKey" label={Messages.accessKey} validators={[validators.required]} />
    <TextInputField name="secretKey" label={Messages.secretKey} validators={[validators.required]} />
  </>
);

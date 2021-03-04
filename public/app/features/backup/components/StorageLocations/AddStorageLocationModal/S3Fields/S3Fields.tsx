import React, { FC } from 'react';
import { TextInputField, validators } from '@percona/platform-core';
import { S3FieldsProps } from './S3Fields.types';
import { Messages } from './S3Fields.Messages';
import { MAX_BUCKET_LENGTH, MAX_ACCESS_KEY_LENGTH, MAX_SECRET_LENGTH } from './S3Fields.constants';
import { SecretToggler } from '../../../SecretToggler';

const required = [validators.required];
const bucketValidators = [validators.required, validators.minLength(3)];
const accessKeyValidators = [validators.required, validators.minLength(16)];

export const S3Fields: FC<S3FieldsProps> = ({ endpoint, accessKey, secretKey, bucketName }) => (
  <>
    <TextInputField name="endpoint" label={Messages.endpoint} validators={required} initialValue={endpoint} />
    <TextInputField
      inputProps={{ maxLength: MAX_BUCKET_LENGTH }}
      name="bucketName"
      label={Messages.bucketName}
      validators={bucketValidators}
      initialValue={bucketName}
    />
    <TextInputField
      inputProps={{ maxLength: MAX_ACCESS_KEY_LENGTH }}
      name="accessKey"
      label={Messages.accessKey}
      validators={accessKeyValidators}
      initialValue={accessKey}
    />
    <SecretToggler
      fieldProps={{ name: 'secretKey', label: 'Secret Key', validators: required }}
      secret={secretKey}
      maxLength={MAX_SECRET_LENGTH}
      readOnly={false}
    />
  </>
);

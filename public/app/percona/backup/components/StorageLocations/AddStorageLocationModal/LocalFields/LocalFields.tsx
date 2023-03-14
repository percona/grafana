import React, { FC } from 'react';

import { TextInputField, validators } from 'app/percona/shared/core-ui';

import { Messages } from './LocalFields.messages';
import { LocalFieldsProps } from './LocalFields.types';

const required = [validators.required];

export const LocalFields: FC<LocalFieldsProps> = ({ name, path }) => (
  <TextInputField name={name} validators={required} label={Messages.path} initialValue={path} />
);

import { TextareaInputField } from '@percona/platform-core';
import React, { FC } from 'react';

export const WebHookTokenFields: FC = () => <TextareaInputField name="token" label="Bearer Token" />;

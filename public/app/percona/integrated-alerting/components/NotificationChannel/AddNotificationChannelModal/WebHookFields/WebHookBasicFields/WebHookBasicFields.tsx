import React, { FC } from 'react';
import { TextInputField } from '@percona/platform-core';
import { SecretToggler } from 'app/percona/shared/components/Elements/SecretToggler';

export const WebHookBasicFields: FC = () => (
  <>
    <TextInputField name="user" label="User" />
    <SecretToggler readOnly={false} fieldProps={{ name: 'password', label: 'Password' }} />
  </>
);

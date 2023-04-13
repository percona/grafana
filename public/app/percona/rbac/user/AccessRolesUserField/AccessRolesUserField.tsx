import React, { FC } from 'react';
import { Controller } from 'react-hook-form';

import { Field } from '@grafana/ui';

import AccessRolesSelect from '../../AccessRolesSelect';

import { Messages } from './AccessRolesUserField.messages';
import { AccessRolesUserFieldProps } from './AccessRolesUserField.types';

export const AccessRolesUserField: FC<AccessRolesUserFieldProps> = ({ control }) => (
  <Field label={Messages.label}>
    <Controller
      control={control}
      name="roleIds"
      render={({ field }) => (
        <AccessRolesSelect
          allowEmpty
          label={Messages.label}
          roleIds={field.value || []}
          onChange={(roleIds) => field.onChange(roleIds)}
        />
      )}
    />
  </Field>
);

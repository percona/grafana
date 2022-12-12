import React, { FC } from 'react';

import { Input } from '@grafana/ui';

import { Messages } from '../AddEditRoleForm/AddEditRoleForm.messages';

import { LabelsFieldProps } from './LabelsField.types';

const LabelsField: FC<LabelsFieldProps> = ({ register, placeholder }) => {
  // todo: implement correct input field
  return (
    <Input {...register('filter', { required: Messages.metrics.required })} type="text" placeholder={placeholder} />
  );
};

export default LabelsField;

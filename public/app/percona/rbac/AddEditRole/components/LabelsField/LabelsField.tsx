import React, { FC } from 'react';

import { Input } from '@grafana/ui';

import { LabelsFieldProps } from './LabelsField.types';

const LabelsField: FC<LabelsFieldProps> = ({ register, placeholder }) => {
  return <Input {...register('description')} type="text" placeholder={placeholder} />;
};

export default LabelsField;

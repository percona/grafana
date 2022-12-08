import React, { FC } from 'react';

import { Input } from '@grafana/ui';

import { LabelsFieldProps } from './LabelsField.types';

const LabelsField: FC<LabelsFieldProps> = ({ register, placeholder }) => {
  // todo: implement correct input field
  return <Input {...register('filter')} type="text" placeholder={placeholder} />;
};

export default LabelsField;

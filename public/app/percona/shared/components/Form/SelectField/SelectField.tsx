import React, { FC } from 'react';
import { Select } from '@grafana/ui';
import { SelectCommonProps } from '@grafana/ui/src/components/Select/types';
import { withSelectStyles } from '../withSelectStyles/withSelectStyles';
import { LabelWrapper } from '../LabelWrapper';
import { SelectFieldProps } from './SelectField.types';

const SelectFieldWrapper: FC<SelectFieldProps & SelectCommonProps<any>> = ({ label, name, ...props }) => (
  <>
    <LabelWrapper label={label} dataQa={`${name}-select-label`} />
    <Select {...props} />
  </>
);

export const SelectField = withSelectStyles(SelectFieldWrapper);

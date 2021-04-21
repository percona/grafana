import React, { FC } from 'react';
import { MultiSelect } from '@grafana/ui';
import { MultiSelectCommonProps } from '@grafana/ui/src/components/Select/types';
import { withSelectStyles } from '../withSelectStyles/withSelectStyles';
import { LabelWrapper } from '../LabelWrapper';
import { MultiSelectFieldProps } from './MultiSelectField.types';

const MultiSelectFieldWrapper: FC<MultiSelectFieldProps & MultiSelectCommonProps<any>> = ({
  label,
  name,
  ...props
}) => (
  <>
    <LabelWrapper label={label} dataQa={`${name}-select-label`} />
    <MultiSelect {...props} />
  </>
);

export const MultiSelectField = withSelectStyles(MultiSelectFieldWrapper);

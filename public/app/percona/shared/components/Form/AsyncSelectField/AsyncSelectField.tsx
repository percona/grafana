import React, { FC } from 'react';
import { AsyncSelect } from '@grafana/ui';
import { withSelectStyles } from '../withSelectStyles/withSelectStyles';
import { LabelWrapper } from '../LabelWrapper';
import { AsyncSelectFieldProps } from './AsyncSelectField.types';

const AsyncSelectFieldWrapper: FC<AsyncSelectFieldProps<any>> = ({ label, name, ...props }) => (
  <>
    <LabelWrapper label={label} dataQa={`${name}-select-label`} />
    <AsyncSelect {...props} />
  </>
);

export const AsyncSelectField = withSelectStyles(AsyncSelectFieldWrapper);

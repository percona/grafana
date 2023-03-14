/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import React, { FC } from 'react';

import { MultiSelect } from '@grafana/ui';
import { MultiSelectCommonProps } from '@grafana/ui/src/components/Select/types';
import { Label } from 'app/percona/shared/core-ui';
import { LabeledFieldProps } from 'app/percona/shared/core-ui/dist/shared/types';

import { withSelectStyles } from '../withSelectStyles/withSelectStyles';

const MultiSelectFieldWrapper: FC<LabeledFieldProps & MultiSelectCommonProps<any>> = ({
  label,
  name,
  required,
  inputId,
  tooltipLink,
  tooltipText,
  tooltipLinkText,
  tooltipDataTestId,
  tooltipIcon,
  tooltipLinkTarget,
  ...props
}) => (
  <>
    <Label
      name={name}
      label={label}
      required={required}
      inputId={inputId}
      tooltipLink={tooltipLink}
      tooltipLinkText={tooltipLinkText}
      tooltipText={tooltipText}
      tooltipDataTestId={tooltipDataTestId}
      tooltipLinkTarget={tooltipLinkTarget}
      tooltipIcon={tooltipIcon}
    />
    <MultiSelect {...props} />
  </>
);

export const MultiSelectField = withSelectStyles(MultiSelectFieldWrapper);

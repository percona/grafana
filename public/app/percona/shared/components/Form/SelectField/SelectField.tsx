/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import React, { FC } from 'react';

import { Select } from '@grafana/ui';
import { SelectCommonProps } from '@grafana/ui/src/components/Select/types';
import { Label } from 'app/percona/shared/core-ui';
import { LabeledFieldProps } from 'app/percona/shared/core-ui/dist/shared/types';

import { withSelectStyles } from '../withSelectStyles/withSelectStyles';

const SelectFieldWrapper: FC<LabeledFieldProps & SelectCommonProps<any>> = ({
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
    <Select {...props} />
  </>
);

export const SelectField = withSelectStyles(SelectFieldWrapper);

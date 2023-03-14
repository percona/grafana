import { cx } from '@emotion/css';
import React, { FC } from 'react';

import { useStyles2 } from '@grafana/ui';

import { LabeledFieldProps } from '../../shared/types';
import { LinkTooltip } from '../LinkTooltip';

import { getStyles } from './Label.styles';

export const Label: FC<LabeledFieldProps> = ({
  name,
  label,
  labelWrapperClassName,
  labelClassName,
  inputId,
  tooltipText,
  required = false,
  ...linkTooltipProps
}) => {
  const styles = useStyles2(getStyles);

  return label ? (
    <div className={cx(styles.labelWrapper, labelWrapperClassName)}>
      <label className={cx(styles.label, labelClassName)} htmlFor={inputId} data-testid={`${name}-field-label`}>
        {label}
        {required ? ' *' : ''}
      </label>
      {tooltipText && <LinkTooltip tooltipText={tooltipText} {...linkTooltipProps} />}
    </div>
  ) : null;
};

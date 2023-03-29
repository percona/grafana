import { cx } from '@emotion/css';
import React, { FC } from 'react';

import { useStyles2 } from '@grafana/ui';

import { LinkTooltip } from '../../../core-ui/components/LinkTooltip';
import { LabeledFieldProps } from '../../../core-ui/shared/types';

import { getStyles } from './LabelCore.styles';

export const LabelCore: FC<LabeledFieldProps> = ({
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

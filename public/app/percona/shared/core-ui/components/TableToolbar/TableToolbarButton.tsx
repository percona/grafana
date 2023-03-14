import { cx } from '@emotion/css';
import React, { FC } from 'react';

import { useStyles2 } from '@grafana/ui';

import { Icon } from '../Icon';

import { getStyles } from './TableToolbarButton.styles';
import { TableToolbarButtonProps } from './types';

export const TableToolbarButton: FC<TableToolbarButtonProps> = ({ className, icon, label, ...props }) => {
  const styles = useStyles2(getStyles);

  return (
    <button {...props} type="button" className={cx(styles.button, className)}>
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
};

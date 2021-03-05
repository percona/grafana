import React, { FC } from 'react';
import { Icon, useStyles } from '@grafana/ui';
import { WarningBlockProps } from './WarningBlock.types';
import { getStyles } from './WarningBlock.styles';

export const WarningBlock: FC<WarningBlockProps> = ({ message }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.warningWrapper}>
      <Icon className={styles.warningIcon} size="xl" name="info-circle" />
      <span>{message}</span>
    </div>
  );
};

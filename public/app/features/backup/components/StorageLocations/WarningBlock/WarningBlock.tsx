import React, { FC } from 'react';
import { Icon, IconName, useStyles } from '@grafana/ui';
import { WarningBlockProps, WarningType } from './WarningBlock.types';
import { getStyles } from './WarningBlock.styles';

const WarningIconMap: Record<WarningType, IconName> = {
  info: 'info-circle',
  warning: 'exclamation-triangle',
};

export const WarningBlock: FC<WarningBlockProps> = ({ message, type = 'info' }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.warningWrapper}>
      <Icon className={styles.warningIcon} size="xl" name={WarningIconMap[type]} />
      <span>{message}</span>
    </div>
  );
};

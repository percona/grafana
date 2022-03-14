import { useStyles } from '@grafana/ui';
import React from 'react';
import { getStyles } from './SectionLabel.styles';
import { LabelProps } from './SectionLabel.types';

export const Label = ({ name, endDate }: LabelProps) => {
  const styles = useStyles(getStyles);
  return (
    <span className={styles.labelWrapper}>
      {name}
      <span>Expiry Date: {endDate}</span>
    </span>
  );
};

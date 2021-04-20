import React, { FC } from 'react';
import { FieldWrapperProps } from './LabelWrapper.types';
import { getStyles } from './LabelWrapper.styles';
import { useStyles } from '@grafana/ui';

export const LabelWrapper: FC<FieldWrapperProps> = ({ label, dataQa }) => {
  const styles = useStyles(getStyles);

  return (
    <label className={styles.label} data-qa={dataQa}>
      {label}
    </label>
  );
};

import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { AlertDetailsProps } from './AlertDetails.types';
import { getStyles } from './AlertDetails.styles';

export const AlertDetails: FC<AlertDetailsProps> = ({ ruleExpression = '', labels }) => {
  const styles = useStyles(getStyles);

  return (
    <div data-testid="alert-details-wrapper" className={styles.wrapper}>
      <div>
        <span>Rule expression</span>
        <pre>{ruleExpression}</pre>
      </div>
      <div>
        <span>Secondary labels</span>
        <div className={styles.labelsWrapper}>
          {labels.map((label) => (
            <span className={styles.label} key={label}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

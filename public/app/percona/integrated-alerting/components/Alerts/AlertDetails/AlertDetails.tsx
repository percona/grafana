import { Chip } from '@percona/platform-core';
import React, { FC } from 'react';

import { useStyles2 } from '@grafana/ui';

import { getStyles as getMainStyles } from '../Alerts.styles';

import { Messages } from './AlertDetails.messages';
import { getStyles } from './AlertDetails.styles';
import { AlertDetailsProps } from './AlertDetails.types';

export const AlertDetails: FC<AlertDetailsProps> = ({ ruleExpression = '', labels }) => {
  const styles = useStyles2(getStyles);
  const mainStyles = useStyles2(getMainStyles);

  return (
    <div data-testid="alert-details-wrapper" className={styles.wrapper}>
      {ruleExpression && (
        <div>
          <span>{Messages.ruleExpression}</span>
          <pre>{ruleExpression}</pre>
        </div>
      )}
      <div>
        <span>{Messages.secondaryLabels}</span>
        <div className={mainStyles.labelsWrapper}>
          {labels.map((label) => (
            <Chip text={label} key={label} />
          ))}
        </div>
      </div>
    </div>
  );
};

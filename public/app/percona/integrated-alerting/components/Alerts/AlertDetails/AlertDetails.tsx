import { FC } from 'react';

import { useStyles2 } from '@grafana/ui';
import { AlertLabels } from '@grafana/alerting/unstable';

import { Messages } from './AlertDetails.messages';
import { getStyles } from './AlertDetails.styles';
import { AlertDetailsProps } from './AlertDetails.types';

export const AlertDetails: FC<AlertDetailsProps> = ({ labels }) => {
  const styles = useStyles2(getStyles);

  return (
    <div data-testid="alert-details-wrapper" className={styles.wrapper}>
      <span>{Messages.labels}</span>
      <AlertLabels labels={labels} />
    </div>
  );
};

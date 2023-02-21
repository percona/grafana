import React, { FC } from 'react';

import { useStyles2 } from '@grafana/ui';
import { FailedChecksCounts } from 'app/percona/check/types';

import { getStyles } from './Failed.styles';

interface TooltipTextProps {
  counts: FailedChecksCounts;
}

export const TooltipText: FC<TooltipTextProps> = ({
  counts: { emergency, critical, alert, error, warning, debug, info, notice },
}) => {
  const styles = useStyles2(getStyles);
  const sum = emergency + critical + alert + error + warning + debug + info + notice;

  if (!sum) {
    return null;
  }

  return (
    <div className={styles.TooltipWrapper}>
      <div className={styles.TooltipHeader}>Failed checks:&nbsp;{sum}</div>
      <div className={styles.TooltipBody} data-testid="checks-tooltip-body">
        <div>Emergency &ndash;&nbsp;{emergency}</div>
        <div>Alert &ndash;&nbsp;{alert}</div>
        <div>Critical &ndash;&nbsp;{critical}</div>
        <div>Error &ndash;&nbsp;{error}</div>
        <div>Warning &ndash;&nbsp;{warning}</div>
        <div>Notice &ndash;&nbsp;{notice}</div>
        <div>Info &ndash;&nbsp;{info}</div>
        <div>Debug &ndash;&nbsp;{debug}</div>
      </div>
    </div>
  );
};

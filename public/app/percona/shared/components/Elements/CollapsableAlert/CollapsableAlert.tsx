import React, { ReactNode } from 'react';

import { ControlledCollapse, useTheme2 } from '@grafana/ui';

import { getStyles } from './CollapsableAlert.styles';

interface CollapsaleAlertProps {
  children: ReactNode;
}

export const CollapsableAlert = ({ children }: CollapsaleAlertProps) => {
  const theme = useTheme2();
  const styles = getStyles(theme, 'purple');
  return (
    <ControlledCollapse
      label={
        <div className={styles.collapsableLabel}>
          <span className={styles.mainLabel}>CVE security</span>
          <span className={styles.label}>Imforming users about versions of DBs affected by CVE.</span>
          <span className={styles.label}>Partion support (Mongo)</span>
        </div>
      }
      collapsible={false}
      className={styles.collapsableSection}
      bodyCustomClass={styles.collapsableBody}
      headerCustomClass={styles.collapsableHeader}
      headerLabelCustomClass={styles.collapsableHeaderLabel}
    >
      {children}
    </ControlledCollapse>
  );
};

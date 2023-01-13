import React from 'react';

import { ControlledCollapse, useStyles2 } from '@grafana/ui';

import { getStyles } from './CustomCollapsableSection.styles';
import { CustomCollapsableSectionProps } from './CustomCollapsableSection.types';

export const CustomCollapsableSection = ({
  children,
  mainLabel,
  content,
  sideLabel,
}: CustomCollapsableSectionProps) => {
  const styles = useStyles2(getStyles);
  return (
    <ControlledCollapse
      label={
        <div className={styles.collapsableLabel}>
          <span className={styles.mainLabel}>{mainLabel}</span>
          <span className={styles.label}>{content}</span>
          <span className={styles.label}>{sideLabel}</span>
        </div>
      }
      className={styles.collapsableSection}
      bodyCustomClass={styles.collapsableBody}
      headerCustomClass={styles.collapsableHeader}
      headerLabelCustomClass={styles.collapsableHeaderLabel}
    >
      {children}
    </ControlledCollapse>
  );
};

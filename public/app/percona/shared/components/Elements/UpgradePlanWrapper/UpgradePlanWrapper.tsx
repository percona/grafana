import React, { ReactNode } from 'react';

import { Button, Icon, useStyles2 } from '@grafana/ui';

import { getStyles } from './UpgradePlanWrapper.style';

type UpgradePlanWrapperProps = {
  label: string;
  children: ReactNode;
  buttonLabel: string;
  buttonOnClick: () => void;
};

export const UpgradePlanWrapper = ({ label, buttonLabel, buttonOnClick, children }: UpgradePlanWrapperProps) => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLabel}>
          <Icon name={'lock'} /> {label}
        </div>
        <Button variant="secondary" onClick={buttonOnClick}>
          {buttonLabel}
        </Button>
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

import React from 'react';
import { Alert, useStyles2 } from '@grafana/ui';
import { getStyles } from './PortalK8sFreeClusterPromotingMessage.styles';

export const PortalK8sFreeClusterPromotingMessage = () => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.alertWrapper}>
      <Alert title={''} severity="info" data-testid="pmm-server-promote-portal-k8s-cluster-message">
        <p>
          Percona has a time-limited offer for testing DBaaS with a free k8s cluster. Please{' '}
          <a target="_blank" rel="noreferrer" href="https://per.co.na/pmm/freek8s" className={styles.link}>
            read more
          </a>{' '}
          information about this offer
        </p>
      </Alert>
    </div>
  );
};

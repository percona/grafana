import React, { FC } from 'react';

import { Icon, useStyles } from '@grafana/ui';

import { Databases } from '../../../../shared/core';

import { DASHBOARD_URL_MAP } from './DBClusterName.constants';
import { getStyles } from './DBClusterName.styles';
import { DBClusterNameProps } from './DBClusterName.types';

export const DBClusterName: FC<DBClusterNameProps> = ({ dbCluster: { clusterName, databaseType } }) => {
  const styles = useStyles(getStyles);
  const getDashboardUrl = DASHBOARD_URL_MAP[databaseType];

  return (
    <div className={styles.clusterNameWrapper}>
      <span>{clusterName}</span>
      {databaseType !== Databases.postgresql && (
        <a
          href={getDashboardUrl(clusterName)}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.dashboardIcon}
        >
          <Icon name="graph-bar" />
        </a>
      )}
    </div>
  );
};

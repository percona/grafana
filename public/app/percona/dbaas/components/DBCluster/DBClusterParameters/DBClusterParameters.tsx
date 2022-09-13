import React, { FC } from 'react';

import { useStyles } from '@grafana/ui';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';

import { DBClusterStatus } from '../DBCluster.types';
import { DBClusterConnectionItem } from '../DBClusterConnection/DBClusterConnectionItem/DBClusterConnectionItem';
import { getPerconaDBClustersDetails } from 'app/percona/shared/core/selectors';
import { useSelector } from 'react-redux';

import { getStyles } from './DBClusterParameters.styles';
import { DBClusterParametersProps } from './DBClusterParameters.types';

export const DBClusterParameters: FC<DBClusterParametersProps> = ({ dbCluster }) => {
  const styles = useStyles(getStyles);
  const { result: clusters = {}, loading: dbClusterLoading } = useSelector(getPerconaDBClustersDetails);
  const { status = DBClusterStatus.unknown } =
    Object.keys(clusters).length && dbCluster.id ? clusters[dbCluster.id] : {};
  const {
    label: exposeLabel,
    enabled: exposeEnabled,
    disabled: exposeDisabled,
  } = Messages.dbcluster.table.parameters.expose;

  return (
    <>
      {!dbClusterLoading && status && status === DBClusterStatus.ready && (
        <div className={styles.wrapper}>
          <DBClusterConnectionItem
            label={Messages.dbcluster.table.parameters.clusterName}
            value={dbCluster.kubernetesClusterName}
            dataTestId="cluster-parameters-cluster-name"
          />
          <DBClusterConnectionItem
            label={Messages.dbcluster.table.parameters.cpu}
            value={dbCluster.cpu!}
            dataTestId="cluster-parameters-cpu"
          />
          <DBClusterConnectionItem
            label={Messages.dbcluster.table.parameters.memory}
            value={`${dbCluster.memory!} GB`}
            dataTestId="cluster-parameters-memory"
          />
          <DBClusterConnectionItem
            label={Messages.dbcluster.table.parameters.disk}
            value={`${dbCluster.disk!} GB`}
            dataTestId="cluster-parameters-disk"
          />
          <DBClusterConnectionItem
            label={exposeLabel}
            value={dbCluster.expose ? exposeEnabled : exposeDisabled}
            dataTestId="cluster-parameters-expose"
          />
        </div>
      )}
    </>
  );
};

import { logger } from '@percona/platform-core';
import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { MultipleActions } from 'app/percona/dbaas/components/MultipleActions/MultipleActions';

import { getPerconaDBClustersDetails } from '../../../../shared/core/selectors';
import { DBCluster, DBClusterStatus } from '../DBCluster.types';
import { isClusterChanging, newDBClusterService } from '../DBCluster.utils';

import { styles } from './DBClusterActions.styles';
import { DBClusterActionsProps } from './DBClusterActions.types';

export const DBClusterActions: FC<DBClusterActionsProps> = ({
  dbCluster,
  setSelectedCluster,
  setDeleteModalVisible,
  setEditModalVisible,
  setLogsModalVisible,
  setUpdateModalVisible,
  getDBClusters,
}) => {
  const { result: clusters = {} } = useSelector(getPerconaDBClustersDetails);

  const { status } =
    Object.keys(clusters).length && dbCluster.id && !!clusters[dbCluster.id]
      ? clusters[dbCluster.id]
      : { status: undefined };

  const getActions = useCallback(
    (dbCluster: DBCluster) => [
      {
        content: Messages.dbcluster.table.actions.updateCluster,
        disabled:
          !dbCluster.availableImage ||
          status === DBClusterStatus.upgrading ||
          status === DBClusterStatus.deleting ||
          status === DBClusterStatus.changing,
        action: () => {
          setSelectedCluster(dbCluster);
          setUpdateModalVisible(true);
        },
      },
      {
        content: Messages.dbcluster.table.actions.deleteCluster,
        disabled: status === DBClusterStatus.deleting,
        action: () => {
          setSelectedCluster(dbCluster);
          setDeleteModalVisible(true);
        },
      },
      {
        content: Messages.dbcluster.table.actions.editCluster,
        disabled: status !== DBClusterStatus.ready,
        action: () => {
          setSelectedCluster(dbCluster);
          setEditModalVisible(true);
        },
      },
      {
        content: Messages.dbcluster.table.actions.restartCluster,
        disabled: isClusterChanging(status),
        action: async () => {
          try {
            const dbClusterService = newDBClusterService(dbCluster.databaseType);

            await dbClusterService.restartDBCluster(dbCluster);
            getDBClusters();
          } catch (e) {
            logger.error(e);
          }
        },
      },
      {
        content:
          status === DBClusterStatus.ready
            ? Messages.dbcluster.table.actions.suspend
            : Messages.dbcluster.table.actions.resume,
        disabled: status !== DBClusterStatus.ready && status !== DBClusterStatus.suspended,
        action: async () => {
          try {
            const dbClusterService = newDBClusterService(dbCluster.databaseType);

            if (status === DBClusterStatus.ready) {
              await dbClusterService.suspendDBCluster(dbCluster);
            } else {
              await dbClusterService.resumeDBCluster(dbCluster);
            }

            getDBClusters();
          } catch (e) {
            logger.error(e);
          }
        },
      },
      {
        content: Messages.dbcluster.table.actions.logs,
        action: () => {
          setSelectedCluster(dbCluster);
          setLogsModalVisible(true);
        },
      },
    ],
    [
      setSelectedCluster,
      setDeleteModalVisible,
      getDBClusters,
      setEditModalVisible,
      setLogsModalVisible,
      setUpdateModalVisible,
      status,
    ]
  );

  return (
    <div className={styles.actionsColumn}>
      <MultipleActions actions={getActions(dbCluster)} dataTestId="dbcluster-actions" />
    </div>
  );
};

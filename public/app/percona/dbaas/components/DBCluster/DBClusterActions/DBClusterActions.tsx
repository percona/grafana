import React, { FC, useCallback } from 'react';
import { logger } from '@percona/platform-core';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { MultipleActions } from 'app/percona/dbaas/components/MultipleActions/MultipleActions';
import { DBCluster, DBClusterStatus } from '../DBCluster.types';
import { isClusterChanging, newDBClusterService } from '../DBCluster.utils';
import { DBClusterActionsProps } from './DBClusterActions.types';
import { styles } from './DBClusterActions.styles';

export const DBClusterActions: FC<DBClusterActionsProps> = ({
  dbCluster,
  setSelectedCluster,
  setDeleteModalVisible,
  setEditModalVisible,
  setLogsModalVisible,
  setUpdateModalVisible,
  getDBClusters,
}) => {
  const getActions = useCallback(
    (dbCluster: DBCluster) => [
      {
        title: Messages.dbcluster.table.actions.updateCluster,
        disabled:
          !dbCluster.availableImage ||
          dbCluster.status === DBClusterStatus.upgrading ||
          dbCluster.status === DBClusterStatus.deleting ||
          dbCluster.status === DBClusterStatus.changing,
        action: () => {
          setSelectedCluster(dbCluster);
          setUpdateModalVisible(true);
        },
      },
      {
        title: Messages.dbcluster.table.actions.deleteCluster,
        disabled: dbCluster.status === DBClusterStatus.deleting,
        action: () => {
          setSelectedCluster(dbCluster);
          setDeleteModalVisible(true);
        },
      },
      {
        title: Messages.dbcluster.table.actions.editCluster,
        disabled: dbCluster.status !== DBClusterStatus.ready,
        action: () => {
          setSelectedCluster(dbCluster);
          setEditModalVisible(true);
        },
      },
      {
        title: Messages.dbcluster.table.actions.restartCluster,
        disabled: isClusterChanging(dbCluster),
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
        title:
          dbCluster.status === DBClusterStatus.ready
            ? Messages.dbcluster.table.actions.suspend
            : Messages.dbcluster.table.actions.resume,
        disabled: dbCluster.status !== DBClusterStatus.ready && dbCluster.status !== DBClusterStatus.suspended,
        action: async () => {
          try {
            const dbClusterService = newDBClusterService(dbCluster.databaseType);

            if (dbCluster.status === DBClusterStatus.ready) {
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
        title: Messages.dbcluster.table.actions.logs,
        action: () => {
          setSelectedCluster(dbCluster);
          setLogsModalVisible(true);
        },
      },
    ],
    [setSelectedCluster, setDeleteModalVisible, setUpdateModalVisible, getDBClusters]
  );

  return (
    <div className={styles.actionsColumn}>
      <MultipleActions actions={getActions(dbCluster)} dataTestId="dbcluster-actions" />
    </div>
  );
};

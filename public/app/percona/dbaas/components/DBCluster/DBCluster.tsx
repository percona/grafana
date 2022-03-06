import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { useStyles } from '@grafana/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useNavModel } from 'app/core/hooks/useNavModel';
import Page from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { StoreState } from 'app/types';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { Table } from 'app/percona/shared/components/Elements/Table';
import { getKubernetes, getPerconaSettings } from 'app/percona/shared/core/selectors';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { AddClusterButton } from '../AddClusterButton/AddClusterButton';
import { getStyles } from './DBCluster.styles';
import { DBCluster as Cluster } from './DBCluster.types';
import { AddDBClusterModal } from './AddDBClusterModal/AddDBClusterModal';
import { EditDBClusterModal } from './EditDBClusterModal/EditDBClusterModal';
import { DBClusterLogsModal } from './DBClusterLogsModal/DBClusterLogsModal';
import { useDBClusters } from './DBCluster.hooks';
import {
  clusterStatusRender,
  connectionRender,
  databaseTypeRender,
  parametersRender,
  clusterNameRender,
  clusterActionsRender,
} from './ColumnRenderers/ColumnRenderers';
import { DeleteDBClusterModal } from './DeleteDBClusterModal/DeleteDBClusterModal';
import { UpdateDBClusterModal } from './UpdateDBClusterModal/UpdateDBClusterModal';
import { fetchKubernetesAction } from 'app/percona/shared/core/reducers';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { CHECK_OPERATOR_UPDATE_CANCEL_TOKEN, GET_KUBERNETES_CANCEL_TOKEN } from '../Kubernetes/Kubernetes.constants';
import { EmptyBlock } from 'app/percona/shared/components/Elements/EmptyBlock';
import { isKubernetesListUnavailable } from '../Kubernetes/Kubernetes.utils';

export const DBCluster: FC = () => {
  const styles = useStyles(getStyles);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster>();
  const navModel = useNavModel('dbclusters', true);
  const dispatch = useDispatch();
  const [generateToken] = useCancelToken();
  const settings = useSelector(getPerconaSettings);
  const { result: kubernetes = [] } = useSelector(getKubernetes);
  const [dbClusters, getDBClusters, setLoading, loading] = useDBClusters(kubernetes);

  const columns = useMemo(
    () => [
      {
        Header: Messages.dbcluster.table.nameColumn,
        accessor: clusterNameRender,
      },
      {
        Header: Messages.dbcluster.table.databaseTypeColumn,
        accessor: databaseTypeRender,
      },
      {
        Header: Messages.dbcluster.table.connectionColumn,
        accessor: connectionRender,
      },
      {
        Header: Messages.dbcluster.table.clusterParametersColumn,
        accessor: parametersRender,
      },
      {
        Header: Messages.dbcluster.table.clusterStatusColumn,
        accessor: clusterStatusRender({
          setSelectedCluster,
          setLogsModalVisible,
        }),
      },
      {
        Header: Messages.dbcluster.table.actionsColumn,
        accessor: clusterActionsRender({
          setSelectedCluster,
          setDeleteModalVisible,
          setEditModalVisible,
          setLogsModalVisible,
          setUpdateModalVisible,
          getDBClusters,
        }),
      },
    ],
    [setSelectedCluster, setDeleteModalVisible, getDBClusters]
  );

  const AddNewClusterButton = useCallback(
    () => (
      <AddClusterButton
        label={Messages.dbcluster.addAction}
        action={() => setAddModalVisible(!addModalVisible)}
        data-testid="dbcluster-add-cluster-button"
      />
    ),
    [addModalVisible]
  );

  const getRowKey = useCallback(({ original }) => `${original.kubernetesClusterName}${original.clusterName}`, []);

  useEffect(() => {
    if (!deleteModalVisible && !editModalVisible && !logsModalVisible && !updateModalVisible) {
      setSelectedCluster(undefined);
    }
  }, [deleteModalVisible, editModalVisible, logsModalVisible, updateModalVisible]);

  const featureSelector = useCallback((state: StoreState) => !!state.perconaSettings.dbaasEnabled, []);

  useEffect(() => {
    dispatch(
      fetchKubernetesAction({
        kubernetes: generateToken(GET_KUBERNETES_CANCEL_TOKEN),
        operator: generateToken(CHECK_OPERATOR_UPDATE_CANCEL_TOKEN),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <TechnicalPreview />
        <FeatureLoader featureName={Messages.dbaas} featureSelector={featureSelector}>
          {kubernetes.length === 0 || isKubernetesListUnavailable(kubernetes) ? (
            <EmptyBlock>
              <h1>{Messages.kubernetes.noClusters}</h1>
            </EmptyBlock>
          ) : (
            <div>
              <div className={styles.actionPanel}>
                <AddNewClusterButton />
              </div>
              <AddDBClusterModal
                kubernetes={kubernetes}
                isVisible={addModalVisible}
                setVisible={setAddModalVisible}
                onDBClusterAdded={getDBClusters}
                showMonitoringWarning={settings.isLoading || !settings?.publicAddress}
              />
              <DeleteDBClusterModal
                isVisible={deleteModalVisible}
                setVisible={setDeleteModalVisible}
                setLoading={setLoading}
                onClusterDeleted={getDBClusters}
                selectedCluster={selectedCluster}
              />
              {selectedCluster && (
                <EditDBClusterModal
                  isVisible={editModalVisible}
                  setVisible={setEditModalVisible}
                  onDBClusterChanged={getDBClusters}
                  selectedCluster={selectedCluster}
                />
              )}
              {logsModalVisible && (
                <DBClusterLogsModal
                  isVisible={logsModalVisible}
                  setVisible={setLogsModalVisible}
                  dbCluster={selectedCluster}
                />
              )}
              {selectedCluster && updateModalVisible && (
                <UpdateDBClusterModal
                  dbCluster={selectedCluster}
                  isVisible={updateModalVisible}
                  setVisible={setUpdateModalVisible}
                  setLoading={setLoading}
                  onUpdateFinished={getDBClusters}
                />
              )}
              <Table
                columns={columns}
                data={dbClusters}
                loading={loading}
                noData={<AddNewClusterButton />}
                rowKey={getRowKey}
              />
            </div>
          )}
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default DBCluster;

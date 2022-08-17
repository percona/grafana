/* eslint-disable react/display-name */
import { Modal, CheckboxField } from '@percona/platform-core';
import React, { FC, useCallback, useState, useMemo, useEffect } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'react-table';

import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { Table } from 'app/percona/shared/components/Elements/Table';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { Databases } from 'app/percona/shared/core';
import { fetchKubernetesAction, deleteKubernetesAction, addKubernetesAction } from 'app/percona/shared/core/reducers';
import {
  getKubernetes as getKubernetesSelector,
  getDeleteKubernetes,
  getAddKubernetes,
  getPerconaSettingFlag,
} from 'app/percona/shared/core/selectors';

import { AddClusterButton } from '../AddClusterButton/AddClusterButton';

import { AddKubernetesModal } from './AddKubernetesModal/AddKubernetesModal';
import { clusterActionsRender } from './ColumnRenderers/ColumnRenderers';
import {
  GET_KUBERNETES_CANCEL_TOKEN,
  CHECK_OPERATOR_UPDATE_CANCEL_TOKEN,
  DELETE_KUBERNETES_CANCEL_TOKEN,
} from './Kubernetes.constants';
import { getStyles } from './Kubernetes.styles';
import { Kubernetes, OperatorToUpdate, NewKubernetesCluster } from './Kubernetes.types';
import { KubernetesClusterStatus } from './KubernetesClusterStatus/KubernetesClusterStatus';
import { ManageComponentsVersionsModal } from './ManageComponentsVersionsModal/ManageComponentsVersionsModal';
import { UpdateOperatorModal } from './OperatorStatusItem/KubernetesOperatorStatus/UpdateOperatorModal/UpdateOperatorModal';
import { OperatorStatusItem } from './OperatorStatusItem/OperatorStatusItem';
import { PortalK8sFreeClusterPromotingMessage } from './PortalK8sFreeClusterPromotingMessage/PortalK8sFreeClusterPromotingMessage';
import { ViewClusterConfigModal } from './ViewClusterConfigModal/ViewClusterConfigModal';

export const KubernetesInventory: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const navModel = usePerconaNavModel('kubernetes');
  const [selectedCluster, setSelectedCluster] = useState<Kubernetes | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewConfigModalVisible, setViewConfigModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [manageComponentsModalVisible, setManageComponentsModalVisible] = useState(false);
  const [operatorToUpdate, setOperatorToUpdate] = useState<OperatorToUpdate | null>(null);
  const [updateOperatorModalVisible, setUpdateOperatorModalVisible] = useState(false);
  const [generateToken] = useCancelToken();
  const { result: kubernetes = [], loading: kubernetesLoading } = useSelector(getKubernetesSelector);
  const { loading: deleteKubernetesLoading } = useSelector(getDeleteKubernetes);
  const { loading: addKubernetesLoading } = useSelector(getAddKubernetes);
  const loading = kubernetesLoading || deleteKubernetesLoading || addKubernetesLoading;

  const deleteKubernetesCluster = useCallback(
    async (force?: boolean) => {
      if (selectedCluster) {
        setDeleteModalVisible(false);
        await dispatch(deleteKubernetesAction({ kubernetesToDelete: selectedCluster, force }));
        setSelectedCluster(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCluster]
  );

  const columns = useMemo(
    (): Array<Column<Kubernetes>> => [
      {
        Header: Messages.kubernetes.table.nameColumn,
        accessor: 'kubernetesClusterName',
      },
      {
        Header: Messages.kubernetes.table.clusterStatusColumn,
        accessor: (element: Kubernetes) => <KubernetesClusterStatus status={element.status} />,
      },
      {
        Header: Messages.kubernetes.table.operatorsColumn,
        accessor: (element: Kubernetes) => (
          <div>
            <OperatorStatusItem
              databaseType={Databases.mysql}
              operator={element.operators.pxc}
              kubernetes={element}
              setSelectedCluster={setSelectedCluster}
              setOperatorToUpdate={setOperatorToUpdate}
              setUpdateOperatorModalVisible={setUpdateOperatorModalVisible}
            />
            <OperatorStatusItem
              databaseType={Databases.mongodb}
              operator={element.operators.psmdb}
              kubernetes={element}
              setSelectedCluster={setSelectedCluster}
              setOperatorToUpdate={setOperatorToUpdate}
              setUpdateOperatorModalVisible={setUpdateOperatorModalVisible}
            />
          </div>
        ),
      },
      {
        Header: Messages.kubernetes.table.actionsColumn,
        accessor: (kubernetesCluster: Kubernetes) =>
          clusterActionsRender({
            setSelectedCluster,
            setDeleteModalVisible,
            setViewConfigModalVisible,
            setManageComponentsModalVisible,
          })(kubernetesCluster),
      },
    ],
    []
  );

  const AddNewClusterButton = useCallback(
    () => (
      <AddClusterButton
        label={Messages.kubernetes.addAction}
        action={() => setAddModalVisible(!addModalVisible)}
        data-testid="kubernetes-new-cluster-button"
      />
    ),
    [addModalVisible]
  );

  const addKubernetes = useCallback(async (cluster: NewKubernetesCluster, setPMMAddress = false) => {
    await dispatch(
      addKubernetesAction({
        kubernetesToAdd: cluster,
        setPMMAddress,
        token: generateToken(DELETE_KUBERNETES_CANCEL_TOKEN),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('dbaasEnabled'), []);

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
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <TechnicalPreview />
        <FeatureLoader featureName={Messages.dbaas} featureSelector={featureSelector}>
          <div>
            <div className={styles.actionPanel}>
              <AddNewClusterButton />
            </div>
            {selectedCluster && (
              <ViewClusterConfigModal
                isVisible={viewConfigModalVisible}
                setVisible={() => setViewConfigModalVisible(false)}
                selectedCluster={selectedCluster}
              />
            )}
            <AddKubernetesModal
              isVisible={addModalVisible}
              addKubernetes={addKubernetes}
              setAddModalVisible={setAddModalVisible}
            />
            <Modal
              title={Messages.kubernetes.deleteModal.title}
              isVisible={deleteModalVisible}
              onClose={() => setDeleteModalVisible(false)}
            >
              <Form
                onSubmit={() => {}}
                render={({ form, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <>
                      <h4 className={styles.deleteModalContent}>{Messages.kubernetes.deleteModal.confirmMessage}</h4>
                      <CheckboxField name="force" label={Messages.kubernetes.deleteModal.labels.force} />
                      <HorizontalGroup justify="space-between" spacing="md">
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => setDeleteModalVisible(false)}
                          data-testid="cancel-delete-kubernetes-button"
                        >
                          {Messages.kubernetes.deleteModal.cancel}
                        </Button>
                        <Button
                          variant="destructive"
                          size="md"
                          onClick={() => deleteKubernetesCluster(Boolean(form.getState().values.force))}
                          data-testid="delete-kubernetes-button"
                        >
                          {Messages.kubernetes.deleteModal.confirm}
                        </Button>
                      </HorizontalGroup>
                    </>
                  </form>
                )}
              />
            </Modal>
            {selectedCluster && manageComponentsModalVisible && (
              <ManageComponentsVersionsModal
                selectedKubernetes={selectedCluster}
                isVisible={manageComponentsModalVisible}
                setVisible={setManageComponentsModalVisible}
                setSelectedCluster={setSelectedCluster}
              />
            )}
            {selectedCluster && operatorToUpdate && updateOperatorModalVisible && (
              <UpdateOperatorModal
                kubernetesClusterName={selectedCluster.kubernetesClusterName}
                isVisible={updateOperatorModalVisible}
                selectedOperator={operatorToUpdate}
                setVisible={setUpdateOperatorModalVisible}
                setSelectedCluster={setSelectedCluster}
                setOperatorToUpdate={setOperatorToUpdate}
              />
            )}
            <Table columns={columns} data={kubernetes} loading={loading} noData={<AddNewClusterButton />} />
          </div>
        </FeatureLoader>
        {kubernetes.length === 0 && <PortalK8sFreeClusterPromotingMessage />}
      </OldPage.Contents>
    </OldPage>
  );
};

export default KubernetesInventory;

import React, { FC } from 'react';
import { Kubernetes } from '../Kubernetes.types';

interface OperatorStatusRowProps {
  kubernetes: Kubernetes[];
  kubernetesLoading: boolean;
  element: Kubernetes;
}

export const OperatorStatusRow: FC<OperatorStatusRowProps> = ({ kubernetes, element }) => {
  // const styles = useStyles(getStyles);
  // const addDisabled = kubernetes.length === 0 || isKubernetesListUnavailable(kubernetes) || loading;

  return (
    <div data-testid={`${element.kubernetesClusterName}-kubernetes-row-wrapper`}>
      <div>
        {/*  <OperatorStatusItem*/}
        {/*    databaseType={Databases.mysql}*/}
        {/*    operator={element.operators.pxc}*/}
        {/*    kubernetes={element}*/}
        {/*    setSelectedCluster={setSelectedCluster}*/}
        {/*    setOperatorToUpdate={setOperatorToUpdate}*/}
        {/*    setUpdateOperatorModalVisible={setUpdateOperatorModalVisible}*/}
        {/*  />*/}
        {/*  <OperatorStatusItem*/}
        {/*    databaseType={Databases.mongodb}*/}
        {/*    operator={element.operators.psmdb}*/}
        {/*    kubernetes={element}*/}
        {/*    setSelectedCluster={setSelectedCluster}*/}
        {/*    setOperatorToUpdate={setOperatorToUpdate}*/}
        {/*    setUpdateOperatorModalVisible={setUpdateOperatorModalVisible}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<AddClusterButton*/}
        {/*  label={Messages.dbcluster.addAction}*/}
        {/*  disabled={addDisabled}*/}
        {/*  action={() => setAddModalVisible(!addModalVisible)}*/}
        {/*  data-testid="dbcluster-add-cluster-button"*/}
        {/*/>*/}
      </div>
    </div>
  );
};

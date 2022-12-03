import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getDBaaS } from '../../../../../shared/core/selectors';
import { Kubernetes } from '../../../Kubernetes/Kubernetes.types';
import { DBCluster } from '../../DBCluster.types';
import { DB_CLUSTER_INVENTORY_URL } from '../EditDBClusterPage.constants';
import { AddDBClusterFormValues, DBClusterPageMode, EditDBClusterFormValues } from '../EditDBClusterPage.types';
import { getAddInitialValues, getEditInitialValues } from '../EditDBClusterPage.utils';

interface EditDBClusterPageDefaultValuesProps {
  kubernetes: Kubernetes[] | undefined;
  mode: DBClusterPageMode;
}

export const useEditDBClusterPageDefaultValues = ({
  kubernetes,
  mode,
}: EditDBClusterPageDefaultValuesProps): [
  AddDBClusterFormValues | EditDBClusterFormValues | undefined,
  DBCluster | null
] => {
  const history = useHistory();
  const { selectedKubernetesCluster: preSelectedKubernetesCluster, selectedDBCluster } = useSelector(getDBaaS);

  // TODO сделать переход по id на страницу редактирования, если такой кластер есть и его можно отредактировать то позволить редактировать
  console.log(selectedDBCluster);

  // if (mode === 'edit' && !selectedDBCluster) {
  //   history.push(DB_CLUSTER_INVENTORY_URL);
  // }

  // TODO check of edit fields will be added in other branch

  const initialValues = useMemo(() => {
    if (mode === 'create') {
      return kubernetes?.length ? getAddInitialValues(kubernetes, preSelectedKubernetesCluster) : undefined;
    }
    if (mode === 'edit' && selectedDBCluster) {
      return getEditInitialValues(selectedDBCluster);
    } else {
      history.push(DB_CLUSTER_INVENTORY_URL);
    }
    return undefined;
  }, [history, kubernetes, mode, preSelectedKubernetesCluster, selectedDBCluster]);

  return [initialValues, selectedDBCluster];
};

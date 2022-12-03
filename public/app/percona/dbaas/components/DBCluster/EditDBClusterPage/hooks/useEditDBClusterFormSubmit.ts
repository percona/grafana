import { useDispatch, useSelector } from 'react-redux';

import { addDbClusterAction } from '../../../../../shared/core/reducers/dbaas/addDBCluster/addDBCluster';
import { updateDBClusterAction } from '../../../../../shared/core/reducers/dbaas/updateDBCluster/updateDBCluster';
import { getAddDbCluster, getDBaaS } from '../../../../../shared/core/selectors';
import { ClusterSubmit, DBClusterFormSubmitProps } from '../EditDBClusterPage.types';

export const useEditDBClusterFormSubmit = ({
  mode,
  showPMMAddressWarning,
}: DBClusterFormSubmitProps): [ClusterSubmit, boolean | undefined, string, any] => {
  const dispatch = useDispatch();
  const { result, loading } = useSelector(getAddDbCluster); // TODO edit
  const { selectedDBCluster } = useSelector(getDBaaS);

  const addCluster = async (values: Record<string, any>) => {
    await dispatch(addDbClusterAction({ values, setPMMAddress: showPMMAddressWarning }));
  };

  // TODO will be added in https://jira.percona.com/browse/PMM-11134

  const editCluster = async (values: Record<string, any>) => {
    if (selectedDBCluster) {
      await dispatch(updateDBClusterAction({ values, selectedDBCluster }));
    }
    // TODO закрыть страницу после отправки данных
    // onDBClusterChanged(); TODO проверить что за функция
  };

  if (mode === 'create') {
    return [addCluster, loading, 'Create', result];
  } else {
    return [editCluster, loading, 'Edit', result];
  } // TODO will be changes to editCluster in https://jira.percona.com/browse/PMM-11134
};

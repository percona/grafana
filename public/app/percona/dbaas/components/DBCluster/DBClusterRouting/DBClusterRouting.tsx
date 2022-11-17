import React, { FC, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { EditDBClusterPage } from '../EditDBClusterPage/EditDBClusterPage';
import { useQueryParams } from '../../../../../core/hooks/useQueryParams';
import DBCluster from '../DBCluster';
import { getDBaaS, getKubernetes } from '../../../../shared/core/selectors';
import { fetchKubernetesAction } from '../../../../shared/core/reducers';
import { CHECK_OPERATOR_UPDATE_CANCEL_TOKEN, GET_KUBERNETES_CANCEL_TOKEN } from '../../Kubernetes/Kubernetes.constants';
import { resetDBClustersToInitial } from '../../../../shared/core/reducers/dbClusters/dbClusters';
import { useDispatch, useSelector } from 'react-redux';
import { useCancelToken } from '../../../../shared/components/hooks/cancelToken.hook';

export type DBClusterPageMode = 'register' | 'edit' | 'list';

export const DBClusterRouting: FC = () => {
  const dispatch = useDispatch();
  const [generateToken] = useCancelToken();
  const { selectedKubernetesCluster } = useSelector(getDBaaS);
  const [addModalVisible, setAddModalVisible] = useState(!!selectedKubernetesCluster);
  const { result: kubernetes = [], loading: kubernetesLoading } = useSelector(getKubernetes);

  const [mode, setMode] = useState<DBClusterPageMode>('list');

  useEffect(() => {
    if (!selectedKubernetesCluster) {
      dispatch(
        fetchKubernetesAction({
          kubernetes: generateToken(GET_KUBERNETES_CANCEL_TOKEN),
          operator: generateToken(CHECK_OPERATOR_UPDATE_CANCEL_TOKEN),
        })
      );
    }
    return () => {
      dispatch(resetDBClustersToInitial());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {mode === 'register' && (
        <EditDBClusterPage mode="register" setMode={setMode} kubernetes={kubernetes} preSelectedKubernetesCluster={} />
      )}
      {/*{mode === 'edit' && (*/}
      {/*  <EditDBClusterPage*/}
      {/*    mode="edit"*/}
      {/*    kubernetes={}*/}
      {/*    isVisible={}*/}
      {/*    setVisible={}*/}
      {/*    onSubmit={}*/}
      {/*    preSelectedKubernetesCluster={}*/}
      {/*  />*/}
      {/*)}*/}
      {mode === 'list' && <DBCluster setMode={setMode} />}
    </>
  );
};

export default DBClusterRouting;

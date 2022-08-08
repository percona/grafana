import React, { FC, useEffect, useRef } from 'react';
import { getKubernetes as getKubernetesSelector } from '../../../shared/core/selectors';
import { fetchKubernetesAction } from '../../../shared/core/reducers';
import { CHECK_OPERATOR_UPDATE_CANCEL_TOKEN, GET_KUBERNETES_CANCEL_TOKEN } from '../Kubernetes/Kubernetes.constants';
import { useCancelToken } from '../../../shared/components/hooks/cancelToken.hook';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@grafana/ui/src';
import { Redirect } from 'react-router-dom';

export const DBaaSRouting: FC<{}> = ({}) => {
  const { result: kubernetes = [], loading: kubernetesLoading } = useSelector(getKubernetesSelector);
  const firstRender = useRef(true);
  const [generateToken] = useCancelToken();
  const dispatch = useDispatch();
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    dispatch(
      fetchKubernetesAction({
        kubernetes: generateToken(GET_KUBERNETES_CANCEL_TOKEN),
        operator: generateToken(CHECK_OPERATOR_UPDATE_CANCEL_TOKEN),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return kubernetesLoading || firstRender.current ? (
    <div data-testid="dbaas-loading">
      <Spinner />
    </div>
  ) : kubernetes.length > 0 ? (
    <Redirect to="/dbaas/dbclusters" />
  ) : (
    <Redirect to="/dbaas/kubernetes" />
  );
};

export default DBaaSRouting;

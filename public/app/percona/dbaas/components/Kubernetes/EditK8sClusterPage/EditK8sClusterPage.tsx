import {
  CheckboxField,
  PasswordInputField,
  TextareaInputField,
  TextInputField,
  LoaderButton,
  validators,
} from '@percona/platform-core';
import React, { useCallback, useEffect } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, LinkButton, PageToolbar, useStyles } from '@grafana/ui/src';

import { useCancelToken } from '../../../../shared/components/hooks/cancelToken.hook';
import { useShowPMMAddressWarning } from '../../../../shared/components/hooks/showPMMAddressWarning';
import { addKubernetesAction, resetAddK8SClusterState } from '../../../../shared/core/reducers/k8sCluster/k8sCluster';
import { getAddKubernetes } from '../../../../shared/core/selectors';
import { PMMServerUrlWarning } from '../../PMMServerURLWarning/PMMServerUrlWarning';
import { DELETE_KUBERNETES_CANCEL_TOKEN } from '../Kubernetes.constants';
import { NewKubernetesCluster } from '../Kubernetes.types';

import { AWS_CREDENTIALS_DOC_LINK, DBAAS_INVENTORY_URL, K8S_INVENTORY_URL } from './EditK8sClusterPage.constants';
import { Messages as K8sFormMessages } from './EditK8sClusterPage.messages';
import { getStyles } from './EditK8sClusterPage.styles';
import { onKubeConfigValueChange, pasteFromClipboard } from './EditK8sClusterPage.utils';
import { PageHeader } from './PageHeader/PageHeader';

const { required } = validators;
const {
  isEKSCheckboxLabel,
  isEKSCheckboxTooltip,
  awsAccessKeyIDLabel,
  awsAccessKeyIDTooltip,
  awsSecretAccessKeyLabel,
  awsSecretAccessKeyTooltip,
  confirm,
  paste,
  fields,
  cancelButton,
} = K8sFormMessages;

export const EditK8sClusterPage = () => {
  const styles = useStyles(getStyles);
  // const history = useHistory();
  const dispatch = useDispatch();
  const history = useHistory();
  const { result: addK8SClusterResult, loading: addK8SClusterLoading } = useSelector(getAddKubernetes);
  const [showPMMAddressWarning] = useShowPMMAddressWarning();
  const [generateToken] = useCancelToken();

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

  useEffect(() => {
    if (addK8SClusterResult === 'ok') {
      history.push(K8S_INVENTORY_URL);
    }
    return () => {
      dispatch(resetAddK8SClusterState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addK8SClusterResult]);

  return (
    <Form
      onSubmit={(values: NewKubernetesCluster) => {
        addKubernetes(values, showPMMAddressWarning);
      }}
      mutators={{
        setKubeConfigAndName: ([configValue, nameValue]: string[], state, { changeValue }) => {
          changeValue(state, 'kubeConfig', () => configValue);
          changeValue(state, 'name', () => nameValue);
        },
      }}
      render={({
        handleSubmit,
        valid,
        pristine,
        values: { isEKS },
        form,
        submitting,
      }: FormRenderProps<NewKubernetesCluster>) => (
        <form onSubmit={handleSubmit}>
          <>
            <PageToolbar
              title={'KubernetesCluster'}
              parent={'DBaaS'}
              titleHref={K8S_INVENTORY_URL}
              parentHref={DBAAS_INVENTORY_URL}
              className={styles.pageToolbarWrapper}
            >
              <LinkButton href={K8S_INVENTORY_URL} data-testid="cancel-button" variant="secondary" fill="outline">
                {cancelButton}
              </LinkButton>
              <LoaderButton
                data-testid="k8s-cluster-submit-button"
                size="md"
                type="submit"
                variant="primary"
                disabled={!valid || pristine}
                loading={addK8SClusterLoading}
              >
                {confirm}
              </LoaderButton>
            </PageToolbar>
            <PageHeader header={'Register new Kubernetes Cluster'} />
            {showPMMAddressWarning && <PMMServerUrlWarning className={styles.pmmUrlWarning} />}
            <div className={styles.pageContent}>
              <TextInputField
                name="name"
                label={fields.clusterName}
                validators={[required]}
                fieldClassName={styles.k8sField}
              />
              <TextareaInputField
                name="kubeConfig"
                label={
                  <>
                    <div>{fields.kubeConfig}</div>
                    <Button
                      data-testid="kubernetes-paste-from-clipboard-button"
                      variant="primary"
                      fill="outline"
                      onClick={() => {
                        pasteFromClipboard(form.mutators.setKubeConfigAndName);
                      }}
                      type="button"
                      icon="percona-asterisk"
                    >
                      {paste}
                    </Button>
                  </>
                }
                validators={[required]}
                inputProps={{
                  onChange: (event) => {
                    onKubeConfigValueChange(event?.target?.value, form.mutators.setKubeConfigAndName);
                  },
                }}
                fieldClassName={styles.k8ConfigField}
              />
              <CheckboxField
                name="isEKS"
                label={isEKSCheckboxLabel}
                fieldClassName={styles.checkbox}
                tooltipIcon="info-circle"
                tooltipText={isEKSCheckboxTooltip}
              />
              {isEKS && (
                <>
                  <TextInputField
                    name="awsAccessKeyID"
                    label={awsAccessKeyIDLabel}
                    tooltipIcon="info-circle"
                    tooltipText={awsAccessKeyIDTooltip}
                    tooltipLink={AWS_CREDENTIALS_DOC_LINK}
                    validators={[required]}
                    fieldClassName={styles.awsField}
                  />
                  <PasswordInputField
                    name="awsSecretAccessKey"
                    label={awsSecretAccessKeyLabel}
                    tooltipIcon="info-circle"
                    tooltipText={awsSecretAccessKeyTooltip}
                    tooltipLink={AWS_CREDENTIALS_DOC_LINK}
                    validators={[required]}
                    fieldClassName={styles.awsField}
                  />
                </>
              )}
            </div>
          </>
        </form>
      )}
    />
  );
};

export default EditK8sClusterPage;

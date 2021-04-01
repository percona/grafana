import React, { FC } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import { AppEvents } from '@grafana/data';
import { LoaderButton, Modal, logger } from '@percona/platform-core';
import appEvents from 'app/core/app_events';
import { SelectFieldAdapter } from 'app/percona/shared/components/Form/FieldAdapters/FieldAdapters';
import { MultiCheckboxField } from 'app/percona/shared/components/Form/MultiCheckbox/MultiCheckboxField';
import { requiredVersions, buildVersionsFieldName, findRecommendedVersions } from './ManageComponentsVersions.utils';
import { Messages } from './ManageComponentsVersionsModal.messages';
import { Databases } from 'app/percona/shared/core';
import { Overlay } from 'app/percona/shared/components/Elements/Overlay/Overlay';
import {
  ManageComponentsVersionsModalProps,
  ManageComponentsVersionsRenderProps,
  ManageComponentVersionsFields,
} from './ManageComponentsVersionsModal.types';
import { SelectableValue } from '@grafana/data';
import { Operators } from '../../DBCluster/AddDBClusterModal/DBClusterBasicOptions/DBClusterBasicOptions.types';
import { useOperatorsComponentsVersions } from './ManageComponentsVersions.hooks';
import { KubernetesOperatorStatus } from '../OperatorStatusItem/KubernetesOperatorStatus/KubernetesOperatorStatus.types';
import { newDBClusterService } from '../../DBCluster/DBCluster.utils';
import { DATABASE_OPERATORS } from '../../DBCluster/DBCluster.constants';
import { getStyles } from './ManageComponentsVersionsModal.styles';

export const ManageComponentsVersionsModal: FC<ManageComponentsVersionsModalProps> = ({
  selectedKubernetes,
  isVisible,
  setVisible,
}) => {
  const styles = useStyles(getStyles);
  const [
    initialValues,
    operatorsOptions,
    componentOptions,
    possibleComponentOptions,
    versionsOptions,
    versionsFieldName,
    loadingComponents,
    setComponentOptions,
    setVersionsOptions,
    setVersionsFieldName,
  ] = useOperatorsComponentsVersions(selectedKubernetes);
  const onChangeComponent = (values: ManageComponentsVersionsRenderProps, change: FormApi['change']) => (
    component: SelectableValue
  ) => {
    const name = buildVersionsFieldName({ ...values, [ManageComponentVersionsFields.component]: component });

    setVersionsFieldName(name);
    setVersionsOptions(values[name]);
    change(ManageComponentVersionsFields.component, component);
  };
  const onChangeOperator = (values: ManageComponentsVersionsRenderProps, change: FormApi['change']) => (
    operator: SelectableValue
  ) => {
    const newComponentOptions = possibleComponentOptions[operator.value as Operators] as SelectableValue[];
    const name = buildVersionsFieldName({
      ...values,
      [ManageComponentVersionsFields.operator]: operator,
      [ManageComponentVersionsFields.component]: newComponentOptions[0],
    });

    setComponentOptions(newComponentOptions);
    setVersionsFieldName(name);
    setVersionsOptions(values[name]);

    change(ManageComponentVersionsFields.component, newComponentOptions[0]);
    change(ManageComponentVersionsFields.operator, operator);
  };
  const onSubmit = async (values: ManageComponentsVersionsRenderProps) => {
    const { operators, kubernetesClusterName } = selectedKubernetes;
    const operatorsList = Object.entries(operators);

    try {
      for (const [operator, { status }] of operatorsList) {
        if (status === KubernetesOperatorStatus.ok) {
          const service = newDBClusterService(DATABASE_OPERATORS[operator as Operators] as Databases);

          await service.setComponents(kubernetesClusterName, values);
        }
      }

      setVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [Messages.success]);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Overlay isPending={loadingComponents}>
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({
            handleSubmit,
            valid,
            submitting,
            form,
            values,
          }: FormRenderProps<ManageComponentsVersionsRenderProps>) => {
            return (
              <form onSubmit={handleSubmit}>
                <>
                  <Field
                    dataQa="kubernetes-operator"
                    name={ManageComponentVersionsFields.operator}
                    label={Messages.fields.operator}
                    options={operatorsOptions}
                    component={SelectFieldAdapter}
                    disabled={!valid}
                    onChange={onChangeOperator(values, form.change)}
                  />
                  <Field
                    dataQa="kubernetes-component"
                    name={ManageComponentVersionsFields.component}
                    label={Messages.fields.component}
                    options={componentOptions}
                    component={SelectFieldAdapter}
                    disabled={!valid}
                    onChange={onChangeComponent(values, form.change)}
                  />
                  <MultiCheckboxField
                    name={versionsFieldName}
                    className={styles.versionsWrapper}
                    label={Messages.fields.versions}
                    initialOptions={versionsOptions}
                    recommendedOptions={findRecommendedVersions(versionsOptions)}
                    recommendedLabel={Messages.recommended}
                    validators={[requiredVersions]}
                  />
                  <HorizontalGroup justify="space-between" spacing="md">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setVisible(false)}
                      data-qa="kubernetes-components-versions-cancel"
                    >
                      {Messages.cancel}
                    </Button>
                    <LoaderButton
                      variant="primary"
                      size="md"
                      disabled={!valid}
                      loading={submitting}
                      data-qa="kubernetes-components-versions-save"
                    >
                      {Messages.save}
                    </LoaderButton>
                  </HorizontalGroup>
                </>
              </form>
            );
          }}
        />
      </Overlay>
    </Modal>
  );
};

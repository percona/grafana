import React, { FC } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { Button, HorizontalGroup } from '@grafana/ui';
import { Modal } from '@percona/platform-core';
import { SelectFieldAdapter } from 'app/percona/shared/components/Form/FieldAdapters';
import { MultiCheckboxField } from 'app/percona/shared/components/Form/MultiCheckbox/MultiCheckboxField';
import { requiredVersions, buildVersionsFieldName, findRecommendedVersions } from './ManageComponentsVersions.utils';
import { Messages } from './ManageComponentsVersionsModal.messages';
import { Overlay } from 'app/percona/shared/components/Elements/Overlay/Overlay';
import {
  ManageComponentsVersionsModalProps,
  ManageComponentsVersionsRenderProps,
  ManageComponentVersionsFields,
} from './ManageComponentsVersionsModal.types';
import { SelectableValue } from '@grafana/data';
import { Operators } from '../../DBCluster/AddDBClusterModal/DBClusterBasicOptions/DBClusterBasicOptions.types';
import { useOperatorsComponentsVersions } from './ManageComponentsVersions.hooks';

export const ManageComponentsVersionsModal: FC<ManageComponentsVersionsModalProps> = ({
  selectedKubernetes,
  isVisible,
  setVisible,
}) => {
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

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Overlay isPending={loadingComponents}>
        <Form
          initialValues={initialValues}
          onSubmit={(values: ManageComponentsVersionsRenderProps) => {
            console.log(values);
          }}
          render={({ handleSubmit, valid, form, values }: FormRenderProps<ManageComponentsVersionsRenderProps>) => {
            return (
              <form onSubmit={handleSubmit}>
                <>
                  <Field
                    dataQa="kubernetes-operator"
                    name={ManageComponentVersionsFields.operator}
                    label={Messages.fields.operator}
                    options={operatorsOptions}
                    component={SelectFieldAdapter}
                    onChange={onChangeOperator(values, form.change)}
                  />
                  <Field
                    dataQa="kubernetes-component"
                    name={ManageComponentVersionsFields.component}
                    label={Messages.fields.component}
                    options={componentOptions}
                    component={SelectFieldAdapter}
                    onChange={onChangeComponent(values, form.change)}
                  />
                  <MultiCheckboxField
                    name={versionsFieldName}
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
                    <Button
                      variant="primary"
                      size="md"
                      disabled={!valid}
                      onClick={() => console.log('SAVE')}
                      data-qa="kubernetes-components-versions-save"
                    >
                      {Messages.save}
                    </Button>
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

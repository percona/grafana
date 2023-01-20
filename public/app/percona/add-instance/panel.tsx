/* eslint-disable react/display-name,@typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import React, { MouseEventHandler, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { PageToolbar, ToolbarButton, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

import { Databases } from '../../percona/shared/core';

import { AddInstance } from './components/AddInstance/AddInstance';
import AddRemoteInstance from './components/AddRemoteInstance/AddRemoteInstance';
import { Messages } from './components/AddRemoteInstance/AddRemoteInstance.messages';
import AzureDiscovery from './components/AzureDiscovery/Discovery';
import Discovery from './components/Discovery/Discovery';
import { ADD_INSTANCE_FORM_NAME } from './panel.constants';
import { getStyles } from './panel.styles';
import { InstanceTypesExtra, InstanceAvailable, AvailableTypes, AddInstanceRouteParams } from './panel.types';

const availableInstanceTypes: AvailableTypes[] = [
  InstanceTypesExtra.rds,
  InstanceTypesExtra.azure,
  Databases.postgresql,
  Databases.mysql,
  Databases.proxysql,
  Databases.mongodb,
  InstanceTypesExtra.external,
  Databases.haproxy,
];

const AddInstancePanel = () => {
  const { result: settings } = useSelector(getPerconaSettings);
  const { azureDiscoverEnabled } = settings!;
  const { instanceType = '' } = useParams<AddInstanceRouteParams>();
  const [selectedInstance, selectInstance] = useState<InstanceAvailable>({
    type: availableInstanceTypes.includes(instanceType as AvailableTypes) ? instanceType : '',
  });
  const [formName, setFormName] = useState(instanceType ? ADD_INSTANCE_FORM_NAME : '');
  const [showSelection, setShowSelection] = useState(!instanceType);
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const styles = useStyles2(getStyles);

  const handleSubmit = async (submitPromise: Promise<void>) => {
    setSubmitting(true);
    await submitPromise;
    setSubmitting(false);
  };

  const InstanceForm = useMemo(
    () => () =>
      (
        <>
          {selectedInstance.type === InstanceTypesExtra.rds && (
            <Discovery onSubmit={handleSubmit} selectInstance={selectInstance} />
          )}
          {selectedInstance.type === InstanceTypesExtra.azure && (
            <AzureDiscovery onSubmit={handleSubmit} selectInstance={selectInstance} />
          )}
          {selectedInstance.type !== InstanceTypesExtra.rds && selectedInstance.type !== InstanceTypesExtra.azure && (
            <AddRemoteInstance onSubmit={handleSubmit} instance={selectedInstance} selectInstance={selectInstance} />
          )}
        </>
      ),
    [selectedInstance]
  );

  const submitLabel = useMemo(
    () =>
      showSelection
        ? Messages.selectionStep.next
        : selectedInstance.type === InstanceTypesExtra.rds || selectedInstance.type === InstanceTypesExtra.azure
        ? Messages.configurationStep.discover
        : Messages.configurationStep.next,
    [showSelection, selectedInstance]
  );

  const handleCancel: MouseEventHandler = (e) => {
    history.push('/add-instance');
    selectInstance({ type: '' });
    setShowSelection(true);
    setFormName('');
  };

  const handleShowConfiguration: MouseEventHandler = (e) => {
    setShowSelection(false);
    history.push('/add-instance/' + selectedInstance.type);

    if (showSelection) {
      e.preventDefault();
      setFormName(ADD_INSTANCE_FORM_NAME);
    }
  };

  return (
    <Page>
      <PageToolbar
        title={showSelection ? Messages.pageTitleSelection : Messages.pageTitleConfiguration}
        onGoBack={history.goBack}
      >
        <ToolbarButton onClick={handleCancel}>
          {showSelection ? Messages.selectionStep.cancel : Messages.configurationStep.cancel}
        </ToolbarButton>
        <ToolbarButton
          form={formName}
          disabled={!selectedInstance.type || submitting}
          variant="primary"
          onClick={handleShowConfiguration}
        >
          {submitLabel}
        </ToolbarButton>
      </PageToolbar>
      <Page.Contents className={styles.page}>
        {showSelection ? (
          <AddInstance
            showAzure={!!azureDiscoverEnabled}
            selectedInstanceType={selectedInstance}
            onSelectInstanceType={selectInstance}
          />
        ) : (
          <InstanceForm />
        )}
      </Page.Contents>
    </Page>
  );
};

export default AddInstancePanel;

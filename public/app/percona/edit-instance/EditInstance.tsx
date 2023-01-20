import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useHistory, useParams } from 'react-router-dom';

import { PageToolbar, ToolbarButton, ToolbarButtonRow } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { InventoryService } from 'app/percona/inventory/Inventory.service';

import { Labels } from '../add-instance/components/AddRemoteInstance/FormParts';

import { Messages } from './EditInstance.messages';
import { EditInstanceFormValues, EditInstanceRouteParams, Instance } from './EditInstance.types';
import {
  getCustomLabelsToAddEdit,
  getCustomLabelKeysToRemove,
  getInitialValues,
  getServiceType,
} from './EditInstance.utils';

const EditInstancePage: React.FC = () => {
  const history = useHistory();
  const { serviceId } = useParams<EditInstanceRouteParams>();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<Instance>();

  useEffect(() => {
    fetchService(serviceId);
  }, [serviceId]);

  const fetchService = async (serviceId: string) => {
    setIsLoading(true);
    const result = await InventoryService.getService('/service_id/' + serviceId);
    const serviceType = getServiceType(result);
    const service = result[serviceType];

    setService(service);
    setIsLoading(false);
  };

  const handleCancel = () => {
    history.push('/inventory/services');
  };

  const handleSubmit = (values: EditInstanceFormValues) => {
    const toAddEdit = getCustomLabelsToAddEdit(service?.custom_labels || {}, values.custom_labels || '');
    const toRemove = getCustomLabelKeysToRemove(service?.custom_labels || {}, values.custom_labels || '');

    // todo: actually submit data
    console.log('add-edit', toAddEdit);
    console.log('remove', toRemove);
  };

  return (
    <Form
      initialValues={getInitialValues(service)}
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <Page>
          <PageToolbar title={Messages.title} onGoBack={handleCancel}>
            <ToolbarButtonRow>
              <ToolbarButton onClick={handleCancel}>{Messages.cancel}</ToolbarButton>
              <ToolbarButton onClick={handleSubmit} variant="primary">
                {Messages.saveChanges}
              </ToolbarButton>
            </ToolbarButtonRow>
          </PageToolbar>
          <Page.Contents isLoading={isLoading}>
            <h3>{Messages.formTitle(service?.service_name || '')}</h3>
            <form>
              <Labels showNodeFields={false} />
            </form>
          </Page.Contents>
        </Page>
      )}
    />
  );
};

export default EditInstancePage;

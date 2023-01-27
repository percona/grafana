import { logger } from '@percona/platform-core';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useHistory, useParams } from 'react-router-dom';

import { AppEvents } from '@grafana/data';
import { Button, Modal, PageToolbar, ToolbarButton, ToolbarButtonRow } from '@grafana/ui';
import appEvents from 'app/core/app_events';
import { Page } from 'app/core/components/Page/Page';
import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { useAppDispatch } from 'app/store/store';

import { Labels } from '../add-instance/components/AddRemoteInstance/FormParts';
import { useCancelToken } from '../shared/components/hooks/cancelToken.hook';
import { updateServiceAction } from '../shared/core/reducers/services';
import { DbServicePayload } from '../shared/services/services/Services.types';

import { FETCH_SERVICE_CANCEL_TOKEN } from './EditInstance.constants';
import { Messages } from './EditInstance.messages';
import { EditInstanceFormValues, EditInstanceRouteParams } from './EditInstance.types';
import { getInitialValues, getService, toPayload } from './EditInstance.utils';

const EditInstancePage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { serviceId } = useParams<EditInstanceRouteParams>();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<DbServicePayload>();
  const [generateToken] = useCancelToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchService(serviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const fetchService = async (serviceId: string) => {
    setIsLoading(true);
    const result = await InventoryService.getService(
      '/service_id/' + serviceId,
      generateToken(FETCH_SERVICE_CANCEL_TOKEN)
    );
    const service = getService(result);

    setService(service);
    setIsLoading(false);
  };

  const handleCancel = () => {
    history.push('/inventory/services');
  };

  const handleSubmit = async (values: EditInstanceFormValues) => {
    if (!service) {
      return;
    }

    try {
      await dispatch(
        updateServiceAction({
          current: service,
          serviceId: service.service_id,
          labels: {
            cluster: values.cluster,
            environment: values.environment,
            replication_set: values.replication_set,
          },
          custom_labels: toPayload(values.custom_labels || ''),
        })
      ).unwrap();
      appEvents.emit(AppEvents.alertSuccess, [
        Messages.success.title(service.service_name),
        Messages.success.description,
      ]);
      history.push('/inventory/services');
    } catch (error) {
      logger.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Form
      initialValues={getInitialValues(service)}
      onSubmit={handleSubmit}
      render={({ handleSubmit, submitting }) => (
        <>
          <Modal
            isOpen={isModalOpen}
            title={Messages.formTitle(service?.service_name || '')}
            onDismiss={handleCloseModal}
          >
            <p>
              {Messages.modal.description}
              {/* todo: add back in when docs are available */}
              {/* {Messages.modal.details}
              <a className={styles.link}>
                {Messages.modal.detailsLink}
              </a>
              {Messages.modal.dot} */}
            </p>
            <Modal.ButtonRow>
              <Button onClick={handleSubmit}>{Messages.modal.confirm}</Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                {Messages.modal.cancel}
              </Button>
            </Modal.ButtonRow>
          </Modal>
          <Page>
            <PageToolbar title={Messages.title} onGoBack={handleCancel}>
              <ToolbarButtonRow>
                <ToolbarButton onClick={handleCancel}>{Messages.cancel}</ToolbarButton>
                <ToolbarButton onClick={handleOpenModal} variant="primary" disabled={submitting}>
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
        </>
      )}
    />
  );
};

export default EditInstancePage;

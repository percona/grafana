import { FC, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useParams } from 'react-router-dom-v5-compat';

import { AppEvents } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Alert, Button, Stack, Modal, useStyles2 } from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { AppChromeUpdate } from 'app/core/components/AppChrome/AppChromeUpdate';
import { Page } from 'app/core/components/Page/Page';
import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { useAppDispatch } from 'app/store/store';

import { Labels } from '../add-instance/components/AddRemoteInstance/FormParts';
import {
  PMM_EDIT_INSTANCE_PAGE,
  PMM_SERVICES_PAGE,
} from '../shared/components/PerconaBootstrapper/PerconaNavigation/PerconaNavigation.constants';
import { useCancelToken } from '../shared/components/hooks/cancelToken.hook';
import { updateServiceAction } from '../shared/core/reducers/services';
import { CustomLabelsUtils } from '../shared/helpers/customLabels';
import { logger } from '../shared/helpers/logger';
import { DbServicePayload } from '../shared/services/services/Services.types';

import {
  EDIT_INSTANCE_DOCS_LINK,
  FETCH_AGENTS_CANCEL_TOKEN,
  FETCH_SERVICE_CANCEL_TOKEN,
} from './EditInstance.constants';
import { Messages } from './EditInstance.messages';
import { getStyles } from './EditInstance.styles';
import { EditInstanceFormValues, RdsAuthMode, RdsExporter } from './EditInstance.types';
import { getInitialValues, getRdsExporter, getService, toRdsCredentialsPayload } from './EditInstance.utils';
import { RdsCredentials } from './components/RdsCredentials/RdsCredentials';

const EditInstancePage: FC = () => {
  const dispatch = useAppDispatch();
  const { serviceId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<DbServicePayload>();
  const [rdsExporter, setRdsExporter] = useState<RdsExporter>();
  const [generateToken] = useCancelToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const styles = useStyles2(getStyles);

  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const fetchService = async (serviceId: string) => {
    setIsLoading(true);
    const result = await InventoryService.getService(serviceId, generateToken(FETCH_SERVICE_CANCEL_TOKEN));
    const service = getService(result);

    setService(service);
    setRdsExporter(await fetchRdsExporter(service));
    setIsLoading(false);
  };

  // The rds_exporter belongs to the node, not to the service, so it takes a second lookup. Only
  // remote RDS nodes have one; anything else leaves the credentials section out of the form.
  const fetchRdsExporter = async (service?: DbServicePayload): Promise<RdsExporter | undefined> => {
    if (!service?.node_id) {
      return undefined;
    }

    try {
      const agents = await InventoryService.getAgents(
        undefined,
        service.node_id,
        generateToken(FETCH_AGENTS_CANCEL_TOKEN)
      );

      return getRdsExporter(agents);
    } catch (error) {
      // A service that cannot be checked for an exporter is still editable for its labels.
      logger.error(error);
      return undefined;
    }
  };

  const handleCancel = () => {
    locationService.push('/inventory/services');
  };

  // Runs as the form's onSubmit, so react-final-form has already validated and, on failure, marked
  // every field touched to surface its error. Confirming in the modal is what actually saves.
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const saveChanges = async (values: EditInstanceFormValues) => {
    if (!service) {
      return;
    }

    setIsSaving(true);
    const credentials = toRdsCredentialsPayload(values, rdsExporter);

    // Credentials go first: the server can reject them on their own merits, and doing them before
    // the labels keeps a rejection from leaving half the form saved. api.put surfaces the server's
    // message itself, so there is nothing to add here beyond stopping.
    if (credentials && rdsExporter) {
      try {
        await InventoryService.updateAgent(rdsExporter.agentId, { rds_exporter: credentials });
      } catch (error) {
        logger.error(error);
        // Nothing was saved, so drop back to the form where the rejected values can be corrected.
        setIsSaving(false);
        setIsModalOpen(false);
        return;
      }
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
          custom_labels: CustomLabelsUtils.toPayload(values.custom_labels || ''),
        })
      ).unwrap();
      appEvents.emit(AppEvents.alertSuccess, [
        Messages.success.title(service.service_name),
        Messages.success.description,
      ]);
      locationService.push('/inventory/services');
    } catch (error) {
      logger.error(error);

      if (credentials) {
        appEvents.emit(AppEvents.alertWarning, [Messages.partial.title, Messages.partial.description]);
      }

      setIsModalOpen(false);
    }

    setIsSaving(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Form
      initialValues={getInitialValues(service, rdsExporter)}
      onSubmit={handleOpenModal}
      render={({ handleSubmit, values }) => {
        const credentialsChanged = !!toRdsCredentialsPayload(values, rdsExporter);

        return (
          <>
            <AppChromeUpdate
              actions={
                <Stack direction="row" height="auto" justifyContent="flex-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    data-testid="edit-instance-cancel"
                    type="button"
                    onClick={handleCancel}
                  >
                    {Messages.cancel}
                  </Button>
                  <Button
                    data-testid="edit-instance-submit"
                    size="sm"
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSaving}
                  >
                    {Messages.saveChanges}
                  </Button>
                </Stack>
              }
            />
            <Modal
              isOpen={isModalOpen}
              title={Messages.formTitle(service?.service_name || '')}
              onDismiss={handleCloseModal}
            >
              <p>
                {Messages.modal.description}
                {Messages.modal.details}
                <a target="_blank" rel="noopener noreferrer" className={styles.link} href={EDIT_INSTANCE_DOCS_LINK}>
                  {Messages.modal.detailsLink}
                </a>
                {Messages.modal.dot}
              </p>
              {service?.cluster !== values?.cluster && (
                <Alert title={Messages.modal.cluster.title} severity="warning">
                  {Messages.modal.cluster.description}
                  <a target="_blank" rel="noopener noreferrer" href={EDIT_INSTANCE_DOCS_LINK} className={styles.link}>
                    {Messages.modal.cluster.descriptionLink}
                  </a>
                  {Messages.modal.cluster.dot}
                </Alert>
              )}
              {credentialsChanged && (
                <Alert title={Messages.modal.credentials.title} severity="info">
                  {Messages.modal.credentials.description}
                </Alert>
              )}
              {values?.rds_auth_mode === RdsAuthMode.hostCredentials && credentialsChanged && (
                <Alert title={Messages.modal.hostCredentials.title} severity="warning">
                  {Messages.modal.hostCredentials.description}
                </Alert>
              )}
              <Modal.ButtonRow>
                <Button onClick={() => saveChanges(values)} disabled={isSaving}>
                  {Messages.modal.confirm}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  {Messages.modal.cancel}
                </Button>
              </Modal.ButtonRow>
            </Modal>
            <Page
              navId={PMM_SERVICES_PAGE.id}
              pageNav={PMM_EDIT_INSTANCE_PAGE}
              renderTitle={() => <h1>{Messages.formTitle(service?.service_name || '')}</h1>}
            >
              <Page.Contents isLoading={isLoading}>
                <form onSubmit={handleSubmit} data-testid="edit-instance-form">
                  <Labels showNodeFields={false} />
                  {rdsExporter && <RdsCredentials exporter={rdsExporter} mode={values?.rds_auth_mode} />}
                  {/* enable submit by keyboard */}
                  <input type="submit" className={styles.hidden} />
                </form>
              </Page.Contents>
            </Page>
          </>
        );
      }}
    />
  );
};

export default EditInstancePage;

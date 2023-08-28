/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Row } from 'react-table';
import { useLocalStorage } from 'react-use';

import { AppEvents } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Button, HorizontalGroup, InlineSwitch, Modal, useStyles2 } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { CheckboxField } from 'app/percona/shared/components/Elements/Checkbox';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import {
  fetchActiveServiceTypesAction,
  fetchServicesAction,
  removeServicesAction,
} from 'app/percona/shared/core/reducers/services';
import { getServices } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { logger } from 'app/percona/shared/helpers/logger';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { appEvents } from '../../../core/app_events';
import { GET_SERVICES_CANCEL_TOKEN } from '../Inventory.constants';
import { Messages } from '../Inventory.messages';
import { FlattenService } from '../Inventory.types';

import { getAgentsMonitoringStatus } from './Services.utils';
import Clusters from './Services/Clusters';
import ServicesTable from './Services/ServicesTable';
import { getStyles } from './Tabs.styles';

export const Services = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelectedRows] = useState<Array<Row<FlattenService>>>([]);
  const [actionItem, setActionItem] = useState<FlattenService | null>(null);
  const navModel = usePerconaNavModel('inventory-services');
  const [generateToken] = useCancelToken();
  const dispatch = useAppDispatch();
  const { isLoading, services: fetchedServices } = useSelector(getServices);
  const styles = useStyles2(getStyles);
  const flattenServices = useMemo(
    () =>
      fetchedServices.map((value) => {
        return {
          type: value.type,
          cluster: value.params.cluster || value.params.customLabels?.cluster,
          ...value.params,
          agentsStatus: getAgentsMonitoringStatus(value.params.agents ?? []),
        };
      }),
    [fetchedServices]
  );
  const [showClusters, setShowClusters] = useLocalStorage('pmm-organize-by-clusters', false);

  const deletionMsg = useMemo(() => {
    const servicesToDelete = actionItem ? [actionItem] : selected;

    return Messages.services.deleteConfirmation(servicesToDelete.length);
  }, [actionItem, selected]);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchServicesAction({ token: generateToken(GET_SERVICES_CANCEL_TOKEN) }));
      await dispatch(fetchActiveServiceTypesAction());
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddService = useCallback(() => {
    locationService.push('/add-instance');
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeServices = useCallback(
    async (forceMode) => {
      const servicesToDelete = actionItem ? [actionItem] : selected.map((s) => s.original);

      try {
        const params = servicesToDelete.map((s) => ({
          serviceId: s.serviceId,
          force: forceMode,
        }));
        const successfullyDeleted = await dispatch(removeServicesAction({ services: params })).unwrap();

        if (successfullyDeleted > 0) {
          appEvents.emit(AppEvents.alertSuccess, [
            Messages.services.servicesDeleted(successfullyDeleted, servicesToDelete.length),
          ]);
        }

        if (actionItem) {
          setActionItem(null);
        } else {
          setSelectedRows([]);
        }
        loadData();
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
    },
    [actionItem, dispatch, loadData, selected]
  );

  const handleSelectionChange = useCallback((rows: Array<Row<FlattenService>>) => {
    setSelectedRows(rows);
  }, []);

  const handleDelete = useCallback((service: FlattenService) => {
    setActionItem(service);
    setModalVisible(true);
  }, []);

  const onModalClose = useCallback(() => {
    setModalVisible(false);
    setActionItem(null);
  }, []);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents isLoading={isLoading}>
        <FeatureLoader>
          <HorizontalGroup height={40} justify="flex-end" align="flex-start">
            <InlineSwitch
              id="organize-by-clusters"
              label={Messages.services.organizeByClusters}
              className={styles.clustersSwitch}
              value={showClusters}
              onClick={() => setShowClusters(!showClusters)}
              showLabel
              transparent
            />
            <Button
              size="md"
              disabled={selected.length === 0}
              onClick={() => {
                setModalVisible(true);
              }}
              icon="trash-alt"
              variant="destructive"
            >
              {Messages.delete}
            </Button>
            <Button icon="plus" onClick={onAddService}>
              {Messages.services.add}
            </Button>
          </HorizontalGroup>
          <Modal
            title={
              <div className="modal-header-title">
                <span className="p-l-1">{Messages.confirmAction}</span>
              </div>
            }
            isOpen={modalVisible}
            onDismiss={onModalClose}
          >
            <Form
              onSubmit={() => {}}
              render={({ values, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <>
                    <h4 className={styles.confirmationText}>{deletionMsg}</h4>
                    <FormElement
                      dataTestId="form-field-force"
                      label={Messages.forceMode}
                      element={<CheckboxField label={Messages.services.forceConfirmation} name="force" />}
                    />
                    <HorizontalGroup justify="space-between" spacing="md">
                      <Button variant="secondary" size="md" onClick={onModalClose}>
                        {Messages.cancel}
                      </Button>
                      <Button
                        variant="destructive"
                        size="md"
                        onClick={() => {
                          removeServices(values.force);
                          setModalVisible(false);
                        }}
                      >
                        {Messages.proceed}
                      </Button>
                    </HorizontalGroup>
                  </>
                </form>
              )}
            />
          </Modal>
          {showClusters ? (
            <Clusters services={flattenServices} onDelete={handleDelete} />
          ) : (
            <ServicesTable
              flattenServices={flattenServices}
              onSelectionChange={handleSelectionChange}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          )}
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default Services;

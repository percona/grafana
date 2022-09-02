import { CheckboxField, logger } from '@percona/platform-core';
import React, { useState, useCallback, useEffect } from 'react';
import { Form } from 'react-final-form';

import { AppEvents } from '@grafana/data';
import { Button, HorizontalGroup, Modal } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { InventoryDataService, Model } from 'app/percona/inventory/Inventory.tools';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { Table } from 'app/percona/shared/components/Elements/Table/Table';
import { SelectedTableRows } from 'app/percona/shared/components/Elements/Table/Table.types';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { filterFulfilled, processPromiseResults } from 'app/percona/shared/helpers/promises';

import { appEvents } from '../../../core/app_events';
import { GET_SERVICES_CANCEL_TOKEN, SERVICES_COLUMNS } from '../Inventory.constants';
import { InventoryService } from '../Inventory.service';
import { ServicesList } from '../Inventory.types';

import { styles } from './Tabs.styles';

interface Service {
  service_id: string;
  service_name: string;
  node_id: string;
  address: string;
  port: string;
  [key: string]: string;
}

export const Services = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<Model[]>([]);
  const [selected, setSelectedRows] = useState([]);
  const navModel = usePerconaNavModel('inventory-services');
  const [generateToken] = useCancelToken();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result: ServicesList = await InventoryService.getServices(generateToken(GET_SERVICES_CANCEL_TOKEN));

      setData(InventoryDataService.getServiceModel(result));
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeServices = useCallback(
    async (services: Array<SelectedTableRows<Service>>, forceMode) => {
      try {
        setLoading(true);
        // eslint-disable-next-line max-len
        const requests = services.map((service) =>
          InventoryService.removeService({ service_id: service.original.service_id, force: forceMode })
        );
        const results = await processPromiseResults(requests);
        const successfullyDeleted = results.filter(filterFulfilled).length;

        appEvents.emit(AppEvents.alertSuccess, [
          `${successfullyDeleted} of ${services.length} services successfully deleted`,
        ]);
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
      setSelectedRows([]);
      loadData();
    },
    [loadData]
  );

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <FeatureLoader>
          <div className={styles.tableWrapper}>
            <div className={styles.actionPanel}>
              <Button
                size="md"
                disabled={selected.length === 0}
                onClick={() => {
                  setModalVisible(!modalVisible);
                }}
                icon="trash-alt"
                variant="destructive"
                className={styles.destructiveButton}
              >
                Delete
              </Button>
            </div>
            <Modal
              title={
                <div className="modal-header-title">
                  <span className="p-l-1">Confirm action</span>
                </div>
              }
              isOpen={modalVisible}
              onDismiss={() => setModalVisible(false)}
            >
              <Form
                onSubmit={() => {}}
                render={({ form, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <>
                      <h4 className={styles.confirmationText}>
                        Are you sure that you want to permanently delete {selected.length}{' '}
                        {selected.length === 1 ? 'service' : 'services'}?
                      </h4>
                      <FormElement
                        dataTestId="form-field-force"
                        label="Force mode"
                        element={
                          <CheckboxField label="Force mode is going to delete all associated agents" name="force" />
                        }
                      />
                      <HorizontalGroup justify="space-between" spacing="md">
                        <Button variant="secondary" size="md" onClick={() => setModalVisible(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="md"
                          onClick={() => {
                            removeServices(selected, form.getState().values.force);
                            setModalVisible(false);
                          }}
                          className={styles.destructiveButton}
                        >
                          Proceed
                        </Button>
                      </HorizontalGroup>
                    </>
                  </form>
                )}
              />
            </Modal>
            <div className={styles.tableInnerWrapper} data-testid="table-inner-wrapper">
              <Table
                className={styles.table}
                columns={SERVICES_COLUMNS}
                data={data}
                rowSelection
                onRowSelection={(selected) => setSelectedRows(selected)}
                noData={<h1>No services Available</h1>}
                loading={loading}
              />
            </div>
          </div>
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default Services;

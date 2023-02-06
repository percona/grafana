/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import { CheckboxField, logger, Table } from '@percona/platform-core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Row } from 'react-table';

import { AppEvents } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Button, HorizontalGroup, Modal, useStyles2 } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { SelectedTableRows } from 'app/percona/shared/components/Elements/Table/Table.types';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import {
  fetchServicesAction,
  removeServicesAction,
  RemoveServiceParams,
  fetchActiveServiceTypesAction,
} from 'app/percona/shared/core/reducers/services';
import { getServices } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { appEvents } from '../../../core/app_events';
import { GET_SERVICES_CANCEL_TOKEN, SERVICES_COLUMNS } from '../Inventory.constants';
import { Messages } from '../Inventory.messages';
import { InventoryDataService } from '../Inventory.tools';

import { getStyles } from './Tabs.styles';

interface Service {
  service_id: string;
  service_name: string;
  node_id: string;
  address: string;
  port: string;
  [key: string]: string;
}

export const Services = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelectedRows] = useState<any[]>([]);
  const navModel = usePerconaNavModel('inventory-services');
  const [generateToken] = useCancelToken();
  const dispatch = useAppDispatch();
  const { isLoading, services } = useSelector(getServices);
  const data = useMemo(() => InventoryDataService.getServiceModel(services), [services]);
  const styles = useStyles2(getStyles);

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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeServices = useCallback(
    async (services: Array<SelectedTableRows<Service>>, forceMode) => {
      try {
        const params = services.map<RemoveServiceParams>((s) => ({
          serviceId: s.original.service_id,
          force: forceMode,
        }));
        const successfullyDeleted = await dispatch(removeServicesAction({ services: params })).unwrap();

        appEvents.emit(AppEvents.alertSuccess, [
          Messages.services.tab.deleteSuccess(successfullyDeleted, services.length),
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
    [dispatch, loadData]
  );

  const handleSelectionChange = useCallback((rows: Array<Row<{}>>) => {
    setSelectedRows(rows);
  }, []);

  const handleAddService = useCallback(() => {
    locationService.push('/add-instance');
  }, []);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <FeatureLoader>
          <div className={styles.tableWrapper}>
            <div className={styles.servicesActionPanel}>
              <HorizontalGroup justify="space-between">
                {selected.length === 0 ? (
                  <div className={styles.description}>{Messages.services.tab.selectBulk}</div>
                ) : (
                  <Button
                    size="md"
                    onClick={() => {
                      setModalVisible((visible) => !visible);
                    }}
                    icon="trash-alt"
                    variant="destructive"
                    className={styles.destructiveButton}
                  >
                    {Messages.services.tab.delete(selected.length)}
                  </Button>
                )}
                <Button size="md" onClick={handleAddService} icon="plus" variant="primary">
                  {Messages.services.tab.add}
                </Button>
              </HorizontalGroup>
            </div>
            <Modal
              title={
                <div className="modal-header-title">
                  <span className="p-l-1">{Messages.services.multiDelete.title}</span>
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
                        {Messages.services.multiDelete.description(selected.length)}
                      </h4>
                      <FormElement
                        dataTestId="form-field-force"
                        label={Messages.services.multiDelete.forceMode.label}
                        element={
                          <CheckboxField label={Messages.services.multiDelete.forceMode.description} name="force" />
                        }
                      />
                      <HorizontalGroup justify="space-between" spacing="md">
                        <Button variant="secondary" size="md" onClick={() => setModalVisible(false)}>
                          {Messages.services.multiDelete.cancel}
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
                          {Messages.services.multiDelete.confirm}
                        </Button>
                      </HorizontalGroup>
                    </>
                  </form>
                )}
              />
            </Modal>
            <div className={styles.tableInnerWrapper} data-testid="table-inner-wrapper">
              <Table
                columns={SERVICES_COLUMNS}
                data={data}
                totalItems={data.length}
                rowSelection
                onRowSelection={handleSelectionChange}
                showPagination
                pageSize={25}
                allRowsSelectionMode="page"
                emptyMessage={Messages.services.table.empty}
                emptyMessageClassName={styles.emptyMessage}
                pendingRequest={isLoading}
                overlayClassName={styles.overlay}
              />
            </div>
          </div>
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default Services;

/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import { CheckboxField, logger, Table } from '@percona/platform-core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Column, Row } from 'react-table';

import { AppEvents } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Button, HorizontalGroup, Icon, Modal, TagList, useStyles2 } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { Action } from 'app/percona/dbaas/components/MultipleActions';
import { DetailsRow } from 'app/percona/shared/components/Elements/DetailsRow/DetailsRow';
import { ExpandAndActionsCol } from 'app/percona/shared/components/Elements/ExpandAndActionsCol/ExpandAndActionsCol';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { ServiceIconWithText } from 'app/percona/shared/components/Elements/ServiceIconWithText/ServiceIconWithText';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import {
  fetchServicesAction,
  removeServicesAction,
  fetchActiveServiceTypesAction,
} from 'app/percona/shared/core/reducers/services';
import { getServices } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Service } from 'app/percona/shared/services/services/Services.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { appEvents } from '../../../core/app_events';
import { GET_SERVICES_CANCEL_TOKEN } from '../Inventory.constants';
import { StatusBadge } from '../components/StatusBadge/StatusBadge';

import { getStyles } from './Tabs.styles';

export const Services = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelectedRows] = useState<Array<Row<Service>>>([]);
  const [actionItem, setActionItem] = useState<Service | null>(null);
  const navModel = usePerconaNavModel('inventory-services');
  const [generateToken] = useCancelToken();
  const dispatch = useAppDispatch();
  const { isLoading, services } = useSelector(getServices);
  const styles = useStyles2(getStyles);

  const getActions = useCallback(
    (row: Row<Service>): Action[] => [
      {
        content: (
          <HorizontalGroup spacing="sm">
            <Icon name="trash-alt" />
            <span className={styles.deleteItemTxtSpan}>Delete</span>
          </HorizontalGroup>
        ),
        action: () => {
          setActionItem(row.original);
          setModalVisible(true);
        },
      },
    ],
    [styles.deleteItemTxtSpan]
  );

  const columns = useMemo(
    (): Array<Column<Service>> => [
      {
        Header: 'Service Name',
        accessor: (row) => row.params.serviceName,
        Cell: ({ value, row }: { row: Row<Service>; value: string }) => (
          <ServiceIconWithText text={value} dbType={row.original.type} />
        ),
      },
      {
        Header: 'Agents',
        accessor: 'params',
        width: '70px',
        Cell: ({ value }) => <StatusBadge agents={value.agents || []} />,
      },
      {
        Header: 'Node ID',
        accessor: (row) => row.params.nodeId,
      },
      {
        Header: 'Address',
        accessor: (row) => row.params.address,
      },
      {
        Header: 'Port',
        accessor: (row) => row.params.port,
      },
      {
        Header: 'Actions',
        Cell: ({ row }: { row: Row<Service> }) => <ExpandAndActionsCol actions={getActions(row)} row={row} />,
      },
    ],
    [getActions]
  );

  const deletionMsg = useMemo(() => {
    const servicesToDelete = actionItem ? [actionItem] : selected;

    return `Are you sure that you want to permanently delete ${servicesToDelete.length} service${
      servicesToDelete.length ? 's' : ''
    }`;
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
          serviceId: s.params.serviceId,
          force: forceMode,
        }));
        const successfullyDeleted = await dispatch(removeServicesAction({ services: params })).unwrap();

        appEvents.emit(AppEvents.alertSuccess, [
          `${successfullyDeleted} of ${servicesToDelete.length} services successfully deleted`,
        ]);

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

  const handleSelectionChange = useCallback((rows: Array<Row<Service>>) => {
    setSelectedRows(rows);
  }, []);

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Service>) => {
      const labels = row.original.params.customLabels || {};
      const labelKeys = Object.keys(labels);
      const agents = row.original.params.agents || [];

      return (
        <DetailsRow>
          {!!labelKeys.length && (
            <DetailsRow.Contents title="Labels">
              <TagList className={styles.tagList} tags={labelKeys.map((label) => `${label}=${labels![label]}`)} />
            </DetailsRow.Contents>
          )}
          {!!agents.length && (
            <DetailsRow.Contents title="Agents">
              <StatusBadge agents={row.original.params.agents || []} full />
            </DetailsRow.Contents>
          )}
          <DetailsRow.Contents title="Service ID">
            <span>{row.original.params.serviceId}</span>
          </DetailsRow.Contents>
        </DetailsRow>
      );
    },
    [styles.tagList]
  );

  const onModalClose = useCallback(() => {
    setModalVisible(false);
    setActionItem(null);
  }, []);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <FeatureLoader>
          <HorizontalGroup height={40} justify="flex-end" align="flex-start">
            <Button
              size="md"
              disabled={selected.length === 0}
              onClick={() => {
                setModalVisible(true);
              }}
              icon="trash-alt"
              variant="destructive"
            >
              Delete
            </Button>
            <Button icon="plus" onClick={onAddService}>
              Add Service
            </Button>
          </HorizontalGroup>
          <Modal
            title={
              <div className="modal-header-title">
                <span className="p-l-1">Confirm action</span>
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
                      label="Force mode"
                      element={
                        <CheckboxField label="Force mode is going to delete all associated agents" name="force" />
                      }
                    />
                    <HorizontalGroup justify="space-between" spacing="md">
                      <Button variant="secondary" size="md" onClick={onModalClose}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="md"
                        onClick={() => {
                          removeServices(values.force);
                          setModalVisible(false);
                        }}
                      >
                        Proceed
                      </Button>
                    </HorizontalGroup>
                  </>
                </form>
              )}
            />
          </Modal>
          <Table
            // @ts-ignore
            columns={columns}
            data={services}
            totalItems={services.length}
            rowSelection
            // @ts-ignore
            onRowSelection={handleSelectionChange}
            showPagination
            pageSize={25}
            allRowsSelectionMode="page"
            emptyMessage="No services Available"
            emptyMessageClassName={styles.emptyMessage}
            pendingRequest={isLoading}
            overlayClassName={styles.overlay}
            renderExpandedRow={renderSelectedSubRow}
          />
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default Services;

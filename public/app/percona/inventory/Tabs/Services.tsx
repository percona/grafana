/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import { logger } from '@percona/platform-core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Column, Row } from 'react-table';

import { locationService } from '@grafana/runtime';
import { Badge, Button, HorizontalGroup, Icon, TagList, useStyles2 } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { stripServiceId } from 'app/percona/check/components/FailedChecksTab/FailedChecksTab.utils';
import { Action } from 'app/percona/dbaas/components/MultipleActions';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DetailsRow } from 'app/percona/shared/components/Elements/DetailsRow/DetailsRow';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { ServiceIconWithText } from 'app/percona/shared/components/Elements/ServiceIconWithText/ServiceIconWithText';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { fetchServicesAction, fetchActiveServiceTypesAction } from 'app/percona/shared/core/reducers/services';
import { getServices } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { capitalizeText } from 'app/percona/shared/helpers/capitalizeText';
import { getDashboardLinkForService } from 'app/percona/shared/helpers/getDashboardLinkForService';
import { getExpandAndActionsCol } from 'app/percona/shared/helpers/getExpandAndActionsCol';
import { Service, ServiceStatus } from 'app/percona/shared/services/services/Services.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { GET_SERVICES_CANCEL_TOKEN } from '../Inventory.constants';
import { Messages } from '../Inventory.messages';
import DeleteServiceModal from '../components/DeleteServiceModal';
import DeleteServicesModal from '../components/DeleteServicesModal';
import { StatusBadge } from '../components/StatusBadge/StatusBadge';
import { StatusLink } from '../components/StatusLink/StatusLink';

import { getBadgeColorForServiceStatus, getBadgeIconForServiceStatus } from './Services.utils';
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
            <span className={styles.actionItemTxtSpan}>{Messages.delete}</span>
          </HorizontalGroup>
        ),
        action: () => {
          setActionItem(row.original);
          setModalVisible(true);
        },
      },
      {
        content: (
          <HorizontalGroup spacing="sm">
            <Icon name="pen" />
            <span className={styles.actionItemTxtSpan}>{Messages.edit}</span>
          </HorizontalGroup>
        ),
        action: () => {
          const serviceId = row.original.params.serviceId.split('/').pop();
          locationService.push(`/edit-instance/${serviceId}`);
        },
      },
      {
        content: Messages.services.actions.dashboard,
        action: () => {
          locationService.push(getDashboardLinkForService(row.original.type, row.original.params.serviceName));
        },
      },
      {
        content: Messages.services.actions.qan,
        action: () => {
          locationService.push(`/d/pmm-qan/pmm-query-analytics?var-service_name=${row.original.params.serviceName}`);
        },
      },
    ],
    [styles.actionItemTxtSpan]
  );

  const columns = useMemo(
    (): Array<Column<Service>> => [
      {
        Header: Messages.services.columns.status,
        accessor: (row) => row.params.status,
        Cell: ({ value }: { value: ServiceStatus }) => (
          <Badge
            text={capitalizeText(value)}
            color={getBadgeColorForServiceStatus(value)}
            icon={getBadgeIconForServiceStatus(value)}
          />
        ),
      },
      {
        Header: Messages.services.columns.serviceName,
        accessor: (row) => row.params.serviceName,
        Cell: ({ value, row }: { row: Row<Service>; value: string }) => (
          <ServiceIconWithText text={value} dbType={row.original.type} />
        ),
      },
      {
        Header: Messages.services.columns.nodeName,
        accessor: (row) => row.params.nodeName,
      },
      {
        Header: Messages.services.columns.monitoring,
        accessor: 'params',
        width: '70px',
        Cell: ({ value, row }) => (
          <StatusLink strippedServiceId={stripServiceId(row.original.params.serviceId)} agents={value.agents || []} />
        ),
      },
      {
        Header: Messages.services.columns.address,
        accessor: (row) => row.params.address,
      },
      {
        Header: Messages.services.columns.port,
        accessor: (row) => row.params.port,
        width: '100px',
      },
      getExpandAndActionsCol(getActions),
    ],
    [getActions]
  );

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
          {!!agents.length && (
            <DetailsRow.Contents title={Messages.services.details.agents}>
              <StatusBadge
                strippedServiceId={stripServiceId(row.original.params.serviceId)}
                agents={row.original.params.agents || []}
              />
            </DetailsRow.Contents>
          )}
          <DetailsRow.Contents title={Messages.services.details.serviceId}>
            <span>{row.original.params.serviceId}</span>
          </DetailsRow.Contents>
          {!!labelKeys.length && (
            <DetailsRow.Contents title={Messages.services.details.labels} fullRow>
              <TagList
                colorIndex={9}
                className={styles.tagList}
                tags={labelKeys.map((label) => `${label}=${labels![label]}`)}
              />
            </DetailsRow.Contents>
          )}
        </DetailsRow>
      );
    },
    [styles.tagList]
  );

  const onModalClose = useCallback(() => {
    setModalVisible(false);
    setActionItem(null);
  }, []);

  const onDeleteSuccess = useCallback(() => {
    setSelectedRows([]);
    onModalClose();
    loadData();
  }, [onModalClose, loadData]);

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
              {Messages.delete}
            </Button>
            <Button icon="plus" onClick={onAddService}>
              {Messages.services.add}
            </Button>
          </HorizontalGroup>
          {actionItem ? (
            <DeleteServiceModal
              serviceId={actionItem.params.serviceId}
              serviceName={actionItem.params.serviceName}
              isOpen={modalVisible}
              onCancel={onModalClose}
              onSuccess={onDeleteSuccess}
            />
          ) : (
            <DeleteServicesModal
              services={selected}
              isOpen={modalVisible}
              onSuccess={onDeleteSuccess}
              onDismiss={onModalClose}
            />
          )}
          <Table
            columns={columns}
            data={services}
            totalItems={services.length}
            rowSelection
            onRowSelection={handleSelectionChange}
            showPagination
            pageSize={25}
            allRowsSelectionMode="page"
            emptyMessage={Messages.services.emptyTable}
            pendingRequest={isLoading}
            overlayClassName={styles.overlay}
            renderExpandedRow={renderSelectedSubRow}
            autoResetSelectedRows={false}
            getRowId={useCallback((row: Service) => row.params.serviceId, [])}
          />
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default Services;

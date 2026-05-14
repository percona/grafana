/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useParams } from 'react-router-dom-v5-compat';
import { Row } from 'react-table';

import { AppEvents } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';
import { Badge, Button, Stack, Icon, Link, Modal, TagList, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { Agent, FlattenAgent, ServiceAgentStatus } from 'app/percona/inventory/Inventory.types';
import { SelectedTableRows } from 'app/percona/shared/components/Elements/AnotherTableInstance/Table.types';
import { CheckboxField } from 'app/percona/shared/components/Elements/Checkbox';
import { DetailsRow } from 'app/percona/shared/components/Elements/DetailsRow/DetailsRow';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { ExtendedColumn, FilterFieldTypes, Table } from 'app/percona/shared/components/Elements/Table';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { nodeFromDbMapper } from 'app/percona/shared/core/reducers/nodes';
import { fetchNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
import { fetchServicesAction } from 'app/percona/shared/core/reducers/services';
import { getNodes, getServices } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { getExpandAndActionsCol } from 'app/percona/shared/helpers/getExpandAndActionsCol';
import { logger } from 'app/percona/shared/helpers/logger';
import { filterFulfilled, processPromiseResults } from 'app/percona/shared/helpers/promises';
import { dispatch } from 'app/store/store';
import { useSelector } from 'app/types/store';

import { appEvents } from '../../../core/app_events';
import { GET_AGENTS_CANCEL_TOKEN, GET_NODES_CANCEL_TOKEN, GET_SERVICES_CANCEL_TOKEN } from '../Inventory.constants';
import { Messages } from '../Inventory.messages';
import { InventoryService } from '../Inventory.service';

import { beautifyAgentType, getAgentStatusColor, getAgentStatusText, toAgentModel } from './Agents.utils';
import { getTagsFromLabels } from './Services.utils';
import { getStyles } from './Tabs.styles';
import { AGENT_TYPE_OPTIONS } from './Agents.constants';

import { useRecurringCall } from 'app/percona/shared/core/hooks/recurringCall.hook';
import { DATA_INTERVAL } from 'app/percona/shared/core';

export const Agents: FC = () => {
  const [agentsLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<Agent[]>([]);
  const [selected, setSelectedRows] = useState<any[]>([]);
  const params = useParams();
  const nodeId = params.nodeId ? (params.nodeId === 'pmm-server' ? 'pmm-server' : params.nodeId) : undefined;
  const navModel = usePerconaNavModel(params.serviceId ? 'inventory-services' : 'inventory-nodes');
  const [triggerTimeout, , stopTimeout] = useRecurringCall();
  const [generateToken] = useCancelToken();
  const { isLoading: servicesLoading, services } = useSelector(getServices);
  const { isLoading: nodesLoading, nodes } = useSelector(getNodes);
  const styles = useStyles2(getStyles);

  const mappedNodes = useMemo(
    () => nodeFromDbMapper(nodes).sort((a, b) => a.nodeName.localeCompare(b.nodeName)),
    [nodes]
  );

  const service = services.find((s) => s.params.serviceId === params.serviceId);
  const node = mappedNodes.find((s) => s.nodeId === nodeId);
  const flattenAgents = useMemo(() => data.map((value) => ({ type: value.type, ...value.params })), [data]);

  // FIX PMM-14640: Extract primitive IDs to avoid object reference issues in useEffect dependencies.
  // Problem: Using entire service/node objects in dependencies causes excessive re-renders when
  // Redux state updates, even when the actual service/node we care about hasn't changed.
  // Solution: Extract only the primitive ID values we need to detect when our specific service/node loads.
  const currentServiceId = service?.params.serviceId;
  const currentNodeId = node?.nodeId;

  const columns = useMemo(
    (): Array<ExtendedColumn<FlattenAgent>> => [
      {
        Header: Messages.agents.columns.status,
        accessor: 'status',
        Cell: ({ value }: { value: ServiceAgentStatus }) => (
          <Badge text={getAgentStatusText(value)} color={getAgentStatusColor(value)} />
        ),
        type: FilterFieldTypes.DROPDOWN,
        options: [
          {
            label: 'Done',
            value: ServiceAgentStatus.DONE,
          },
          {
            label: 'Running',
            value: ServiceAgentStatus.RUNNING,
          },
          {
            label: 'Starting',
            value: ServiceAgentStatus.STARTING,
          },
          {
            label: 'Stopping',
            value: ServiceAgentStatus.STOPPING,
          },
          {
            label: 'Unknown',
            value: ServiceAgentStatus.UNKNOWN,
          },
          {
            label: 'Waiting',
            value: ServiceAgentStatus.WAITING,
          },
        ],
      },
      {
        Header: Messages.agents.columns.agentType,
        accessor: 'type',
        Cell: ({ value }) => <>{beautifyAgentType(value)}</>,
        type: FilterFieldTypes.DROPDOWN,
        options: AGENT_TYPE_OPTIONS,
      },
      {
        Header: Messages.agents.columns.agentId,
        accessor: 'agentId',
        type: FilterFieldTypes.TEXT,
      },
      getExpandAndActionsCol(),
    ],
    []
  );

  // FIX PMM-14640: Added all captured variables to dependency array to prevent stale closures.
  // Problem: Empty dependency array [] caused loadData to capture initial values and never update,
  // leading to incorrect API calls with stale serviceId/nodeId.
  // Solution: Include all used variables (params.serviceId, nodeId, generateToken) in dependencies.
  const loadData = useCallback(async () => {
    try {
      const { agents = [] } = await InventoryService.getAgents(
        params.serviceId,
        nodeId,
        generateToken(GET_AGENTS_CANCEL_TOKEN)
      );
      setData(toAgentModel(agents));
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
  }, [params.serviceId, nodeId, generateToken]);

  const renderSelectedSubRow = React.useCallback(
    (row: Row<FlattenAgent>) => {
      const labels = row.original.customLabels || {};
      const labelKeys = Object.keys(labels);

      return (
        <DetailsRow>
          {!!labelKeys.length && (
            <DetailsRow.Contents title={Messages.agents.details.properties} fullRow>
              <TagList colorIndex={9} className={styles.tagList} tags={getTagsFromLabels(labelKeys, labels)} />
            </DetailsRow.Contents>
          )}
        </DetailsRow>
      );
    },
    [styles.tagList]
  );

  const deletionMsg = useMemo(() => Messages.agents.deleteConfirmation(selected.length), [selected]);

  // FIX PMM-14640: Refactored to use only 4 primitive dependencies instead of 7 with unstable objects.
  // Problem: Original had 7 dependencies including service/node objects which changed on every Redux update,
  // causing excessive re-renders and making it hard to understand what triggers the effect.
  // Solution: Use async function pattern with early returns, depend only on URL params (params.serviceId, nodeId)
  // and primitive IDs (currentServiceId, currentNodeId) that change only when our specific data loads.
  // This ensures the effect runs when: (1) URL changes, OR (2) when service/node actually loads from Redux.
  useEffect(() => {
    const initializeData = async () => {
      // Load service data if needed
      if (!service && params.serviceId) {
        await dispatch(fetchServicesAction({ token: generateToken(GET_SERVICES_CANCEL_TOKEN) }));
        return; // Wait for next render when service data is available
      }

      // Load node data if needed
      if (!node && nodeId) {
        await dispatch(fetchNodesAction({ token: generateToken(GET_NODES_CANCEL_TOKEN) }));
        return; // Wait for next render when node data is available
      }

      // Load agents when all required data is available
      setLoading(true);
      loadData()
        .then(() => setLoading(false))
        .then(() => triggerTimeout(loadData, DATA_INTERVAL));
    };

    initializeData();
    return () => stopTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.serviceId, nodeId, currentServiceId, currentNodeId]);
  // Triggers on: URL change OR when service/node loads from Redux

  const removeAgents = useCallback(
    async (agents: Array<SelectedTableRows<FlattenAgent>>, forceMode: boolean) => {
      try {
        setLoading(true);
        // eslint-disable-next-line max-len
        const requests = agents.map((agent) => InventoryService.removeAgent(agent.original.agentId, forceMode));
        const results = await processPromiseResults(requests);

        const successfullyDeleted = results.filter(filterFulfilled).length;

        if (successfullyDeleted > 0) {
          appEvents.emit(AppEvents.alertSuccess, [Messages.agents.agentsDeleted(successfullyDeleted, agents.length)]);
        }
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

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <FeatureLoader>
          <Stack direction="column" height="auto">
            <Link href={`${service ? '/inventory/services' : '/inventory/nodes'}`}>
              <Icon name="arrow-left" size="lg" />
              <span className={styles.goBack}>
                {service ? Messages.agents.goBackToServices : Messages.agents.goBackToNodes}
              </span>
            </Link>
          </Stack>
          {service && (
            <h5 className={styles.agentBreadcrumb}>
              <span>{Messages.agents.breadcrumbLeftService(service.params.serviceName)}</span>
              <span>{Messages.agents.breadcrumbRight}</span>
            </h5>
          )}
          {node && (
            <h5 className={styles.agentBreadcrumb}>
              <span>{Messages.agents.breadcrumbLeftNode(node.nodeName)}</span>
              <span>{Messages.agents.breadcrumbRight}</span>
            </h5>
          )}
          <Stack direction={'column'} height={40} justifyContent="flex-end" alignItems="flex-start">
            <Button
              size="md"
              disabled={selected.length === 0}
              onClick={() => {
                setModalVisible((visible) => !visible);
              }}
              icon="trash-alt"
              variant="destructive"
            >
              {Messages.delete}
            </Button>
          </Stack>
          <Modal
            ariaLabel={t('percona-inventory.agents.confirmAction', 'Confirm action')}
            title={
              <div className="modal-header-title">
                <span className="p-l-1">
                  <Trans i18nKey={'percona-inventory.agents.confirmAction'}>Confirm action</Trans>
                </span>
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
                    <h4 className={styles.confirmationText}>{deletionMsg}</h4>
                    <FormElement
                      dataTestId="form-field-force"
                      label={Messages.forceMode}
                      element={<CheckboxField name="force" label={Messages.agents.forceConfirmation} />}
                    />

                    <Stack justifyContent="space-between" direction="column">
                      <Button variant="secondary" size="md" onClick={() => setModalVisible(false)}>
                        {Messages.cancel}
                      </Button>
                      <Button
                        size="md"
                        onClick={() => {
                          removeAgents(selected, form.getState().values.force);
                          setModalVisible(false);
                        }}
                        variant="destructive"
                      >
                        {Messages.proceed}
                      </Button>
                    </Stack>
                  </>
                </form>
              )}
            />
          </Modal>
          <Table
            columns={columns}
            data={flattenAgents}
            totalItems={flattenAgents.length}
            rowSelection
            autoResetSelectedRows={false}
            autoResetExpanded={false}
            autoResetPage={false}
            onRowSelection={handleSelectionChange}
            showPagination
            pageSize={25}
            allRowsSelectionMode="page"
            emptyMessage={Messages.agents.emptyTable}
            emptyMessageClassName={styles.emptyMessage}
            pendingRequest={agentsLoading || servicesLoading || nodesLoading}
            overlayClassName={styles.overlay}
            renderExpandedRow={renderSelectedSubRow}
            getRowId={useCallback((row: FlattenAgent) => row.agentId, [])}
            showFilter
          />
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default Agents;

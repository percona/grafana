/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import { CheckboxField, Table, logger } from '@percona/platform-core';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Column, Row } from 'react-table';

import { AppEvents } from '@grafana/data';
import { Button, HorizontalGroup, Modal, TagList, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { formatServiceId } from 'app/percona/check/components/FailedChecksTab/FailedChecksTab.utils';
import { Agent, ServiceAgentPayload } from 'app/percona/inventory/Inventory.types';
import { DetailsRow } from 'app/percona/shared/components/Elements/DetailsRow/DetailsRow';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { SelectedTableRows } from 'app/percona/shared/components/Elements/Table/Table.types';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { getExpandAndActionsCol } from 'app/percona/shared/helpers/getExpandAndActionsCol';
import { filterFulfilled, processPromiseResults } from 'app/percona/shared/helpers/promises';

import { appEvents } from '../../../core/app_events';
import { GET_AGENTS_CANCEL_TOKEN } from '../Inventory.constants';
import { InventoryService } from '../Inventory.service';

import { beautifyAgentType, toAgentModel } from './Agents.utils';
import { getStyles } from './Tabs.styles';

export const Agents: FC<GrafanaRouteComponentProps<{ id: string }>> = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<Agent[]>([]);
  const [selected, setSelectedRows] = useState<any[]>([]);
  const navModel = usePerconaNavModel('inventory-services');
  const [generateToken] = useCancelToken();
  const styles = useStyles2(getStyles);
  const serviceId = match.params.id;

  const columns = useMemo(
    (): Array<Column<Agent>> => [
      {
        Header: 'Agent Type',
        accessor: 'type',
        Cell: ({ value }) => beautifyAgentType(value),
      },
      {
        Header: 'Agent ID',
        accessor: (row) => row.params.agentId,
      },
      getExpandAndActionsCol(),
    ],
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result: ServiceAgentPayload = await InventoryService.getAgents(
        formatServiceId(serviceId),
        generateToken(GET_AGENTS_CANCEL_TOKEN)
      );

      setData(toAgentModel(result));
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Agent>) => {
      const labels = row.original.params.customLabels || {};
      const labelKeys = Object.keys(labels);

      return (
        <DetailsRow>
          {!!labelKeys.length && (
            <DetailsRow.Contents title="Labels" fullRow>
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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeAgents = useCallback(
    async (agents: Array<SelectedTableRows<Agent>>, forceMode) => {
      try {
        setLoading(true);
        // eslint-disable-next-line max-len
        const requests = agents.map((agent) =>
          InventoryService.removeAgent({ agent_id: agent.original.params.agentId, force: forceMode })
        );
        const results = await processPromiseResults(requests);

        const successfullyDeleted = results.filter(filterFulfilled).length;

        appEvents.emit(AppEvents.alertSuccess, [
          `${successfullyDeleted} of ${agents.length} agents successfully deleted`,
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

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <FeatureLoader>
          <div className={styles.actionPanel}>
            <Button
              size="md"
              disabled={selected.length === 0}
              onClick={() => {
                setModalVisible(!modalVisible);
              }}
              icon="trash-alt"
              variant="destructive"
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
                      {selected.length === 1 ? 'agent' : 'agents'}?
                    </h4>
                    <FormElement
                      dataTestId="form-field-force"
                      label="Force mode"
                      element={
                        <CheckboxField name="force" label="Force mode is going to delete all associated agents" />
                      }
                    />

                    <HorizontalGroup justify="space-between" spacing="md">
                      <Button variant="secondary" size="md" onClick={() => setModalVisible(false)}>
                        Cancel
                      </Button>
                      <Button
                        size="md"
                        onClick={() => {
                          removeAgents(selected, form.getState().values.force);
                          setModalVisible(false);
                        }}
                        variant="destructive"
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
            data={data}
            totalItems={data.length}
            rowSelection
            onRowSelection={handleSelectionChange}
            showPagination
            pageSize={25}
            allRowsSelectionMode="page"
            emptyMessage="No agents Available"
            emptyMessageClassName={styles.emptyMessage}
            pendingRequest={loading}
            overlayClassName={styles.overlay}
            renderExpandedRow={renderSelectedSubRow}
          />
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default Agents;

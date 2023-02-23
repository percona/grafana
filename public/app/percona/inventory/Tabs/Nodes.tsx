/* eslint-disable @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import { CheckboxField, Table, logger } from '@percona/platform-core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Column } from 'react-table';

import { AppEvents } from '@grafana/data';
import { Button, HorizontalGroup, Modal, TagList, useStyles2 } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { SelectedTableRows } from 'app/percona/shared/components/Elements/Table';
import { FormElement } from 'app/percona/shared/components/Form';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { RemoveNodeParams } from 'app/percona/shared/core/reducers/nodes';
import { fetchNodesAction, removeNodesAction } from 'app/percona/shared/core/reducers/nodes/nodes';
import { getNodes } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Node } from 'app/percona/shared/services/nodes/Nodes.types';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { appEvents } from '../../../core/app_events';
import { GET_NODES_CANCEL_TOKEN } from '../Inventory.constants';

import { getStyles } from './Tabs.styles';

export const NodesTab = () => {
  const { isLoading, nodes } = useSelector(getNodes);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelectedRows] = useState<any[]>([]);
  const navModel = usePerconaNavModel('inventory-nodes');
  const [generateToken] = useCancelToken();
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): Array<Column<Node>> => [
      {
        Header: 'ID',
        accessor: (row) => row.params.nodeId,
      },
      {
        Header: 'Node Type',
        accessor: 'type',
      },
      {
        Header: 'Node Name',
        accessor: (row) => row.params.nodeName,
      },
      {
        Header: 'Addresses',
        accessor: (row) => row.params.address,
      },
      {
        Header: 'Other Details',
        accessor: 'params',
        Cell: ({ value }) => (
          <TagList
            className={styles.tagList}
            tags={Object.keys(value.customLabels || {}).map((label) => `${label}: ${value.customLabels![label]}`)}
          />
        ),
      },
    ],
    [styles.tagList]
  );

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchNodesAction({ token: generateToken(GET_NODES_CANCEL_TOKEN) })).unwrap();
      // const result: NodesList = await InventoryService.getNodes(generateToken(GET_NODES_CANCEL_TOKEN));
      // setData(InventoryDataService.getNodeModel(result));
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

  const removeNodes = useCallback(
    async (nodes: Array<SelectedTableRows<Node>>, forceMode: boolean) => {
      try {
        // eslint-disable-next-line max-len
        const requests = nodes.map<RemoveNodeParams>((node) => ({
          nodeId: node.original.params.nodeId,
          force: forceMode,
        }));

        const successfullyDeleted = await dispatch(removeNodesAction({ nodes: requests })).unwrap();

        appEvents.emit(AppEvents.alertSuccess, [
          `${successfullyDeleted} of ${nodes.length} nodes successfully deleted`,
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

  const proceed = useCallback(
    async (values: Record<any, any>) => {
      await removeNodes(selected, values.force);
      setModalVisible(false);
    },
    [removeNodes, selected]
  );

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

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
                onSubmit={proceed}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <>
                      <h4 className={styles.confirmationText}>
                        Are you sure that you want to permanently delete {selected.length}{' '}
                        {selected.length === 1 ? 'node' : 'nodes'}?
                      </h4>
                      <FormElement
                        dataTestId="form-field-force"
                        label="Force mode"
                        element={
                          <CheckboxField
                            name="force"
                            label={
                              'Force mode is going to delete all ' + 'agents and services associated with the nodes'
                            }
                          />
                        }
                      />
                      <HorizontalGroup justify="space-between" spacing="md">
                        <Button variant="secondary" size="md" onClick={() => setModalVisible(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="md" variant="destructive" className={styles.destructiveButton}>
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
                // @ts-ignore
                columns={columns}
                data={nodes}
                totalItems={nodes.length}
                rowSelection
                onRowSelection={handleSelectionChange}
                showPagination
                pageSize={25}
                allRowsSelectionMode="page"
                emptyMessage="No nodes Available"
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

export default NodesTab;

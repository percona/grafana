import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Row } from 'react-table';
import { style } from 'test/mocks/style';

import { NavModelItem } from '@grafana/data';
import { HorizontalGroup, Icon, useStyles2, Badge, BadgeColor, LinkButton, Button } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { Action } from 'app/percona/dbaas/components/MultipleActions';
import { DumpStatus, DumpStatusColor, DumpStatusText, PMMDumpServices } from 'app/percona/pmm-dump/PmmDump.types';
import { DetailsRow } from 'app/percona/shared/components/Elements/DetailsRow/DetailsRow';
import { ExtendedColumn, FilterFieldTypes, Table } from 'app/percona/shared/components/Elements/Table';
import { fetchPmmDumpAction } from 'app/percona/shared/core/reducers/pmmDump/pmmDump';
import { getDumps } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { getExpandAndActionsCol } from 'app/percona/shared/helpers/getExpandAndActionsCol';
import { logger } from 'app/percona/shared/helpers/logger';
import { dateDifferenceInWords } from 'app/percona/shared/helpers/utils/timeRange';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from './PMMDump.messages';
import { PMMDumpService } from './PMMDump.service';
import { SendToSupportModal } from './SendToSupportModal';
import { getStyles } from './Tabs.styles';
import { PmmDumpLogsModal } from './components/PmmDumpLogsModal/PmmDumpLogsModal';
export const NEW_BACKUP_URL = '/pmm-dump/new';

const pageNav: NavModelItem = {
  icon: 'brain',
  id: 'user-new',
  text: 'PMM Export',
  subTitle:
    'Simplify troubleshooting and accelerate issue resolution by securely sharing relevant data, ensuring a smoother support experience.',
};

export const PMMDump = () => {
  const styles = useStyles2(getStyles);
  const dispatch = useAppDispatch();
  const { isLoading, dumps } = useSelector(getDumps);
  const [selected, setSelectedRows] = useState<Array<Row<PMMDumpServices>>>([]);
  const [isSendToSupportModalOpened, setIsSendToSupportModalOpened] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchPmmDumpAction());
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLogs = useCallback(async () => {
    return PMMDumpService.getLogs2('1', 2, 2);
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeEditModal = (saved = false) => {
    setIsSendToSupportModalOpened(false);
  };

  const getActions = useCallback(
    (row: Row<PMMDumpServices>): Action[] => [
      {
        content: (
          <HorizontalGroup spacing="sm">
            <Icon name="trash-alt" />
            <span className={styles.actionItemTxtSpan}>{Messages.services.actions.delete}</span>
          </HorizontalGroup>
        ),
        action: () => {
          onDelete(row.original);
        },
      },
      {
        content: (
          <HorizontalGroup spacing="sm">
            <Icon name="arrow-right" />
            <span className={styles.actionItemTxtSpan}>{Messages.services.actions.sendToSupport}</span>
          </HorizontalGroup>
        ),
        action: () => {
          setIsSendToSupportModalOpened(true);
        },
      },
      {
        content: (
          <HorizontalGroup spacing="sm">
            <Icon name="eye" />
            <span className={styles.actionItemTxtSpan}>{Messages.services.actions.viewLogs}</span>
          </HorizontalGroup>
        ),
        action: () => {
          // locationService.push(`/d/pmm-qan/pmm-query-analytics?var-service_name=${row.original.serviceName}`);
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [styles.actionItemTxtSpan]
  );

  const onDelete = (value?: PMMDumpServices) => {
    if (value) {
      console.log('onDelete value', value);
    } else if (selected.length > 0) {
      console.log('selected', selected);
    }
    // appEvents.publish(
    //   new ShowConfirmModalEvent({
    //     title: 'Delete',
    //     text: 'Are you sure you want to delete the selected dumps?',
    //     yesText: 'Delete',
    //     icon: 'trash-alt',
    //     onConfirm: () => {
    //       deleteDumps();
    //       dispatch(notifyApp(createSuccessNotification('Dumps deleted')));
    //     },
    //   })
    // );
  };

  const columns = useMemo(
    (): Array<ExtendedColumn<PMMDumpServices>> => [
      {
        Header: Messages.services.columns.id,
        id: 'dump_id',
        accessor: 'dump_id',
        hidden: true,
        type: FilterFieldTypes.TEXT,
      },
      {
        Header: Messages.services.columns.status,
        accessor: 'status',
        Cell: ({ value }: { value: DumpStatus }) => {
          return (
            <div>
              <Badge text={DumpStatusText[value]} color={DumpStatusColor[value as DumpStatus] as BadgeColor} />
              <span role="button" className={styles.logs} onClick={onLogClick}>
                Logs
              </span>
            </div>
          );
        },
        type: FilterFieldTypes.DROPDOWN,
        options: [
          {
            label: DumpStatusText[DumpStatus.BACKUP_STATUS_IN_PROGRESS],
            value: DumpStatus.BACKUP_STATUS_IN_PROGRESS,
          },
          {
            label: DumpStatusText[DumpStatus.BACKUP_STATUS_INVALID],
            value: DumpStatus.BACKUP_STATUS_INVALID,
          },
          {
            label: DumpStatusText[DumpStatus.BACKUP_STATUS_ERROR],
            value: DumpStatus.BACKUP_STATUS_ERROR,
          },
          {
            label: DumpStatusText[DumpStatus.BACKUP_STATUS_SUCCESS],
            value: DumpStatus.BACKUP_STATUS_SUCCESS,
          },
        ],
      },
      {
        Header: Messages.services.columns.created,
        accessor: 'created_at',
        type: FilterFieldTypes.TEXT,
      },
      {
        Header: Messages.services.columns.timeRange,
        accessor: 'timeRange',
        type: FilterFieldTypes.TEXT,
        Cell: ({ value, row }: { row: Row<PMMDumpServices>; value: string }) => {
          return dateDifferenceInWords(row.original.end_time, row.original.start_time);
        },
      },
      {
        Header: Messages.services.columns.startDate,
        accessor: 'start_time',
        type: FilterFieldTypes.TEXT,
      },
      {
        Header: Messages.services.columns.endDate,
        accessor: 'end_time',
        type: FilterFieldTypes.TEXT,
      },
      getExpandAndActionsCol(getActions),
    ],
    [getActions, styles.logs]
  );

  const onLogClick = () => {
    setLogsModalVisible(true);
  };

  const handleLogsClose = () => {
    setLogsModalVisible(false);
  };

  const handleSelectionChange = useCallback((rows: Array<Row<PMMDumpServices>>) => {
    setSelectedRows(rows);
  }, []);

  const renderSelectedSubRow = React.useCallback(
    (row: Row<PMMDumpServices>) => {
      const nodes = row.original.node_ids || [];

      return (
        <DetailsRow>
          {!!nodes.length && (
            <DetailsRow.Contents title={Messages.services.columns.nodes}>
              {row.original.node_ids.map((node: string, index: number) => (
                <div className={styles.nodes} key={index}>
                  {node}
                </div>
              ))}
            </DetailsRow.Contents>
          )}
        </DetailsRow>
      );
    },
    [styles]
  );

  return (
    <Page navId="pmmdump" pageNav={pageNav}>
      <Page.Contents>
        <div className={styles.createDatasetArea}>
          {selected.length > 0 ? (
            <div>
              <Button
                size="md"
                variant="secondary"
                className={styles.actionButton}
                fill="outline"
                data-testid="dump-sendToSupport"
                icon="arrow-right"
                onClick={() => setIsSendToSupportModalOpened(true)}
              >
                {Messages.services.actions.sendToSupport}
              </Button>
              <Button
                size="md"
                variant="secondary"
                className={styles.actionButton}
                fill="outline"
                data-testid="dump-primary"
                icon="trash-alt"
                onClick={() => onDelete()}
              >
                {Messages.services.actions.delete} {selected.length} items
              </Button>
            </div>
          ) : (
            <div>Select services to bulk edit them.</div>
          )}
          <LinkButton href="/" size="md" variant="primary" data-testid="create-dataset" icon="plus">
            {Messages.services.createDataset}
          </LinkButton>
        </div>
        {isSendToSupportModalOpened && <SendToSupportModal onClose={() => closeEditModal()} />}
        <Table
          columns={columns}
          data={dumps}
          totalItems={dumps.length}
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
          getRowId={useCallback((row: PMMDumpServices) => row.dump_id, [])}
        />
        {logsModalVisible && (
          <PmmDumpLogsModal title="test" isVisible onClose={handleLogsClose} getLogChunks={getLogs} />
        )}
      </Page.Contents>
    </Page>
  );
};

export default PMMDump;

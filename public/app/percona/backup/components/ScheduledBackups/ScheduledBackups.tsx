import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { Cell, Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { Button, useStyles } from '@grafana/ui';
import cronstrue from 'cronstrue';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/app_events';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { Messages } from '../../Backup.messages';
import { DetailedDate } from '../DetailedDate';
import { AddBackupModal } from '../AddBackupModal';
import { ScheduledBackup } from './ScheduledBackups.types';
import { ScheduledBackupsService } from './ScheduledBackups.service';
import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from './ScheduledBackups.constants';
import { ScheduledBackupDetails } from './ScheduledBackupsDetails';
import { getStyles } from './ScheduledBackups.styles';
import { AddBackupFormProps } from '../AddBackupModal/AddBackupModal.types';
import { getCronStringFromValues } from 'app/percona/shared/helpers/cron/cron';
import { ScheduledBackupsActions } from './ScheduledBackupsActions';
import { DeleteModal } from 'app/percona/shared/components/Elements/DeleteModal';
import { RetryMode } from '../../Backup.types';
import { formatBackupMode } from '../../Backup.utils';

export const ScheduledBackups: FC = () => {
  const [data, setData] = useState<ScheduledBackup[]>([]);
  const [pending, setPending] = useState(false);
  const [actionPending, setActionPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<ScheduledBackup | null>(null);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [generateToken] = useCancelToken();
  const styles = useStyles(getStyles);

  const retentionValue = useCallback((n: number) => {
    if (n < 0) {
      return '';
    }

    if (n === 0) {
      return Messages.scheduledBackups.unlimited;
    }

    return `${n} backup${n > 1 ? 's' : ''}`;
  }, []);
  const columns = useMemo(
    (): Array<Column<ScheduledBackup>> => [
      {
        Header: Messages.scheduledBackups.table.columns.name,
        accessor: 'name',
        id: 'name',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: Messages.scheduledBackups.table.columns.vendor,
        accessor: 'vendor',
        Cell: ({ value }) => DATABASE_LABELS[value],
      },
      {
        Header: Messages.scheduledBackups.table.columns.frequency,
        accessor: 'cronExpression',
        Cell: ({ value }) => cronstrue.toString(value),
      },
      {
        Header: Messages.scheduledBackups.table.columns.retention,
        accessor: 'retention',
        Cell: ({ value }) => retentionValue(value),
      },
      {
        Header: Messages.scheduledBackups.table.columns.type,
        accessor: 'mode',
        Cell: ({ value }) => formatBackupMode(value),
      },
      {
        Header: Messages.scheduledBackups.table.columns.location,
        accessor: 'locationName',
      },
      {
        Header: Messages.scheduledBackups.table.columns.lastBackup,
        accessor: 'lastBackup',
        Cell: ({ value }) => (value ? <DetailedDate date={value} /> : ''),
      },
      {
        Header: Messages.scheduledBackups.table.columns.actions,
        accessor: 'id',
        width: '150px',
        Cell: ({ row }) => (
          <ScheduledBackupsActions
            pending={actionPending}
            backup={row.original}
            onToggle={handleToggle}
            onDelete={onDeleteClick}
            onEdit={onEditClick}
            onCopy={handleCopy}
          />
        ),
      },
    ],
    []
  );

  const getData = async () => {
    setPending(true);
    try {
      const backups = await ScheduledBackupsService.list(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN));
      setData(backups);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPending(false);
  };

  const renderSelectedSubRow = React.useCallback(
    (row: Row<ScheduledBackup>) => (
      <ScheduledBackupDetails
        name={row.original.name}
        dataModel={row.original.dataModel}
        description={row.original.description}
        cronExpression={row.original.cronExpression}
      />
    ),
    []
  );

  const handleClose = () => {
    setBackupModalVisible(false);
  };

  const handleBackup = async (backup: AddBackupFormProps) => {
    const {
      id,
      service,
      location,
      period,
      month,
      day,
      weekDay,
      startHour,
      startMinute,
      backupName,
      description,
      retryMode,
      retryInterval,
      retryTimes,
      active,
      retention,
      mode,
    } = backup;
    try {
      const cronExpression = getCronStringFromValues(
        period!.value!,
        month!.map((m) => m.value!),
        day!.map((m) => m.value!),
        weekDay!.map((m) => m.value!),
        startHour!.map((m) => m.value!),
        startMinute!.map((m) => m.value!)
      );
      const strRetryInterval = `${retryInterval}s`;
      let resultRetryTimes = retryMode === RetryMode.MANUAL ? 0 : retryTimes;

      if (id) {
        await ScheduledBackupsService.change(
          id,
          active!,
          cronExpression,
          backupName,
          description,
          strRetryInterval,
          resultRetryTimes!,
          retention!
        );
        appEvents.emit(AppEvents.alertSuccess, [Messages.scheduledBackups.getEditSuccess(backupName)]);
      } else {
        await ScheduledBackupsService.schedule(
          service!.value?.id!,
          location!.value!,
          cronExpression,
          backupName,
          description,
          strRetryInterval,
          resultRetryTimes!,
          retention!,
          active!,
          mode
        );
        appEvents.emit(AppEvents.alertSuccess, [Messages.scheduledBackups.addSuccess]);
      }
      setBackupModalVisible(false);
      setSelectedBackup(null);
      getData();
    } catch (e) {
      logger.error(e);
    }
  };

  const handleCopy = async (backup: ScheduledBackup) => {
    const {
      serviceId,
      locationId,
      cronExpression,
      name,
      description,
      retention,
      retryInterval,
      retryTimes,
      mode,
    } = backup;
    const newName = `${Messages.scheduledBackups.copyOf} ${name}`;
    setActionPending(true);
    try {
      await ScheduledBackupsService.schedule(
        serviceId,
        locationId,
        cronExpression,
        newName,
        description,
        retryInterval,
        retryTimes,
        retention,
        false,
        mode
      );
      getData();
    } catch (e) {
      logger.error(e);
    } finally {
      setActionPending(false);
    }
  };

  const handleToggle = async ({ id, enabled }: ScheduledBackup) => {
    setActionPending(true);
    try {
      await ScheduledBackupsService.toggle(id, !enabled);
      getData();
    } catch (e) {
      logger.error(e);
    } finally {
      setActionPending(false);
    }
  };

  const onDeleteClick = (backup: ScheduledBackup) => {
    setDeleteModalVisible(true);
    setSelectedBackup(backup);
  };

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      await ScheduledBackupsService.delete(selectedBackup?.id!);
      appEvents.emit(AppEvents.alertSuccess, [Messages.scheduledBackups.getDeleteSuccess(selectedBackup!.name)]);
      setDeleteModalVisible(false);
      setSelectedBackup(null);
      getData();
    } catch (e) {
      logger.error(e);
    } finally {
      setDeletePending(false);
    }
  };

  const onEditClick = (backup: ScheduledBackup) => {
    setSelectedBackup(backup);
    setBackupModalVisible(true);
  };

  const onAddClick = () => {
    setSelectedBackup(null);
    setBackupModalVisible(true);
  };

  const getCellProps = useCallback(
    (cell: Cell<ScheduledBackup>) => ({
      className: !cell.row.original.enabled ? styles.disabledRow : '',
      key: cell.row.original.id,
    }),
    []
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className={styles.addWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          data-testid="scheduled-backup-add-modal-button"
          onClick={onAddClick}
        >
          {Messages.add}
        </Button>
      </div>
      <Table
        columns={columns}
        data={data}
        totalItems={data.length}
        emptyMessage={Messages.scheduledBackups.table.noData}
        pendingRequest={pending}
        renderExpandedRow={renderSelectedSubRow}
        getCellProps={getCellProps}
      />
      <AddBackupModal
        scheduleMode
        backup={selectedBackup}
        isVisible={backupModalVisible}
        onClose={handleClose}
        onBackup={handleBackup}
      />
      <DeleteModal
        title={Messages.scheduledBackups.deleteModalTitle}
        isVisible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onDelete={handleDelete}
        loading={deletePending}
        message={Messages.scheduledBackups.getDeleteMessage(selectedBackup?.name!)}
      />
    </>
  );
};

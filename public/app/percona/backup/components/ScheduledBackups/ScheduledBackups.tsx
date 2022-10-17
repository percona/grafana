/* eslint-disable react/display-name */
import { logger } from '@percona/platform-core';
import cronstrue from 'cronstrue';
import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { Cell, Column, Row } from 'react-table';

import { AppEvents } from '@grafana/data';
import { Button, useStyles } from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { OldPage } from 'app/core/components/Page/Page';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { DeleteModal } from 'app/percona/shared/components/Elements/DeleteModal';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { DATABASE_LABELS } from 'app/percona/shared/core';
import { fetchStorageLocations } from 'app/percona/shared/core/reducers/backupLocations';
import { getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { getCronStringFromValues } from 'app/percona/shared/helpers/cron/cron';
import { useAppDispatch } from 'app/store/store';

import { Messages } from '../../Backup.messages';
import { RetryMode } from '../../Backup.types';
import { formatBackupMode } from '../../Backup.utils';
import { AddBackupModal } from '../AddBackupModal';
import { AddBackupFormProps } from '../AddBackupModal/AddBackupModal.types';
import { DetailedDate } from '../DetailedDate';

import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from './ScheduledBackups.constants';
import { ScheduledBackupsService } from './ScheduledBackups.service';
import { getStyles } from './ScheduledBackups.styles';
import { ScheduledBackup } from './ScheduledBackups.types';
import { ScheduledBackupsActions } from './ScheduledBackupsActions';
import { ScheduledBackupDetails } from './ScheduledBackupsDetails';

export const ScheduledBackups: FC = () => {
  const [data, setData] = useState<ScheduledBackup[]>([]);
  const [pending, setPending] = useState(false);
  const [actionPending, setActionPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<ScheduledBackup | null>(null);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navModel = usePerconaNavModel('scheduled-backups');
  const [generateToken] = useCancelToken();
  const dispatch = useAppDispatch();
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

  const getData = useCallback(async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = useCallback(
    async (backup: ScheduledBackup) => {
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
        dataModel,
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
          mode,
          dataModel
        );
        getData();
      } catch (e) {
        logger.error(e);
      } finally {
        setActionPending(false);
      }
    },
    [getData]
  );

  const handleToggle = useCallback(
    async ({ id, enabled }: ScheduledBackup) => {
      setActionPending(true);
      try {
        await ScheduledBackupsService.toggle(id, !enabled);
        getData();
      } catch (e) {
        logger.error(e);
      } finally {
        setActionPending(false);
      }
    },
    [getData]
  );

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
        Cell: ({ value }) => cronstrue.toString(value, { use24HourTimeFormat: true }),
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
    [actionPending, handleCopy, handleToggle, retentionValue]
  );

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
      dataModel,
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
          mode,
          dataModel
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
    [styles.disabledRow]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('backupEnabled'), []);

  useEffect(() => {
    getData();
    dispatch(fetchStorageLocations());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <TechnicalPreview />
        <FeatureLoader featureName={Messages.backupManagement} featureSelector={featureSelector}>
          <div className={styles.addWrapper}>
            <Button
              size="md"
              icon="plus-square"
              fill="text"
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
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default ScheduledBackups;

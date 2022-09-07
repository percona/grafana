import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, CollapsableSection, PageToolbar, useStyles2 } from '@grafana/ui';
import { Link } from 'react-router-dom';
import {
  LoaderButton,
  logger,
  Overlay,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import { Field, withTypes } from 'react-final-form';
import { AppEvents, SelectableValue } from '@grafana/data';
import { AddBackupFormProps, SelectableService } from './AddBackupPage.types';
import { RetryModeSelector } from './RetryModeSelector';
import { Messages } from './AddBackupPage.messages';
import { Messages as MessagesBackup } from '../../Backup.messages';
import { toFormBackup, getBackupModeOptions, getDataModelFromVendor, isDataModelDisabled } from './AddBackupPage.utils';
import { AddBackupModalService } from './AddBackupPage.service';
import { ApiVerboseError, Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import { DATA_MODEL_OPTIONS, MAX_BACKUP_NAME } from './AddBackupPage.constants';
import { getStyles } from './AddBackupPage.styles';
import { BackupMode, BackupType, DataModel } from '../../Backup.types';
import { BackupErrorSection } from '../BackupErrorSection/BackupErrorSection';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { BackupService } from '../../Backup.service';
import { BACKUP_CANCEL_TOKEN, LIST_ARTIFACTS_CANCEL_TOKEN } from '../BackupInventory/BackupInventory.constants';
import { apiErrorParser, isApiCancelError } from 'app/percona/shared/helpers/api';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { locationService } from '@grafana/runtime';
import appEvents from 'app/core/app_events';
import { BackupInventoryService } from '../BackupInventory/BackupInventory.service';
import { Backup } from '../BackupInventory/BackupInventory.types';
import { ScheduledBackupsService } from '../ScheduledBackups/ScheduledBackups.service';
import { ScheduledBackup } from '../ScheduledBackups/ScheduledBackups.types';
import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from '../ScheduledBackups/ScheduledBackups.constants';
import { PageSwitcher } from './PageSwitcher/PageSwitcher';
import { ScheduleSection } from './ScheduleSection/ScheduleSection';
import { cx } from '@emotion/css';

const AddBackupPage: FC<GrafanaRouteComponentProps<{ type: string; id: string }>> = ({ match }) => {
  const [queryParams] = useQueryParams();
  const scheduleMode: boolean = (queryParams['scheduled'] as boolean) || match.params.type === 'scheduled_task_id';
  const [backup, setBackup] = useState<Backup | ScheduledBackup | null>(null);

  const [pending, setPending] = useState(false);
  const styles = useStyles2(getStyles);
  const [modalTitle, setModalTitle] = useState(Messages.getModalTitle(scheduleMode, !!backup));
  const initialValues = useMemo(() => toFormBackup(backup, scheduleMode), [backup, scheduleMode]);
  const { Form } = withTypes<AddBackupFormProps>();
  const editing = !!backup;

  const [backupErrors, setBackupErrors] = useState<ApiVerboseError[]>([]);
  const [generateToken] = useCancelToken();

  const getBackupData = useCallback(async () => {
    setPending(true);

    try {
      let backups: Backup[] | ScheduledBackup[];
      let backup: Backup | ScheduledBackup | null = null;
      if (scheduleMode) {
        backups = await ScheduledBackupsService.list(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN));
      } else {
        backups = await BackupInventoryService.list(generateToken(LIST_ARTIFACTS_CANCEL_TOKEN));
      }
      for (const value of backups) {
        if (value.id === `/${match.params.type}/${match.params.id}`) {
          backup = value;
          break;
        }
      }
      setBackup(backup ?? null);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackup = async (values: AddBackupFormProps) => {
    try {
      await BackupService.backup(values, generateToken(BACKUP_CANCEL_TOKEN));
      if (scheduleMode) {
        appEvents.emit(AppEvents.alertSuccess, [
          values.id
            ? MessagesBackup.scheduledBackups.getEditSuccess(values.backupName)
            : MessagesBackup.scheduledBackups.addSuccess,
        ]);
        setBackupErrors([]);
        locationService.push('/backup/scheduled');
      } else {
        appEvents.emit(AppEvents.alertSuccess, [MessagesBackup.backupInventory.addSuccess]);
        setBackupErrors([]);
        locationService.push('/backup/inventory');
      }
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }

      setBackupErrors(apiErrorParser(e));
      logger.error(e);
    }
  };

  const handleSubmit = (values: AddBackupFormProps) => {
    handleBackup({
      ...values,
      retention: parseInt(`${values.retention}`, 10),
      retryTimes: parseInt(`${values.retryTimes}`, 10),
    });
  };

  const onClose = () => {};

  useEffect(() => setModalTitle(Messages.getModalTitle(scheduleMode, editing)), [editing, scheduleMode]);

  useEffect(() => {
    getBackupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay isPending={pending}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        mutators={{
          changeVendor: ([vendor]: [Databases], state, tools) => {
            tools.changeValue(state, 'vendor', () => vendor);
            tools.changeValue(state, 'dataModel', () => getDataModelFromVendor(vendor));
            //TODO remove this when we support incremental backups for MySQL
            if (vendor === Databases.mysql) {
              tools.changeValue(state, 'mode', () => BackupMode.SNAPSHOT);
            }
          },
          changeDataModel: ([labels]: [NodeListOf<HTMLLabelElement> | null], state, tools) => {
            if (labels?.length) {
              const label = labels[0].textContent;

              if (label === BackupMode.PITR) {
                tools.changeValue(state, 'dataModel', () => DataModel.LOGICAL);
              }
            }
          },
        }}
        render={({ handleSubmit, valid, pristine, submitting, values, form }) => (
          <form onSubmit={handleSubmit}>
            <PageToolbar title={modalTitle} pageIcon="bell">
              <LoaderButton
                data-testid="backup-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {Messages.getSubmitButtonText(values.type === BackupType.SCHEDULED, editing)}
              </LoaderButton>
              <Link to={scheduleMode ? '/backup/scheduled' : '/backup/inventory'}>
                <Button data-testid="storage-location-cancel-button" variant="secondary" onClick={onClose}>
                  {Messages.cancelAction}
                </Button>
              </Link>
            </PageToolbar>
            <div className={styles.contentOuter}>
              <div className={styles.contentInner}>
                {!editing && <PageSwitcher editing={editing} setModalTitle={setModalTitle} />}
                <h4 className={styles.headingStyle}>Backup info</h4>
                <div className={styles.formContainer}>
                  <span className={styles.wideField}>
                    <TextInputField
                      name="backupName"
                      label={Messages.backupName}
                      validators={[validators.required, validators.maxLength(MAX_BACKUP_NAME)]}
                    />
                  </span>
                  <span className={styles.SelectFieldWrap}>
                    <Field name="service" validate={validators.required}>
                      {({ input }) => (
                        <AsyncSelectField
                          label={Messages.serviceName}
                          isSearchable={false}
                          disabled={editing}
                          loadOptions={AddBackupModalService.loadServiceOptions}
                          defaultOptions
                          {...input}
                          onChange={(service: SelectableValue<SelectableService>) => {
                            input.onChange(service);
                            form.mutators.changeVendor(service.value!.vendor);
                          }}
                          className={styles.selectField}
                          data-testid="service-select-input"
                        />
                      )}
                    </Field>
                  </span>
                  <span className={styles.radioButtonField}>
                    <RadioButtonGroupField
                      disabled={isDataModelDisabled(values)}
                      options={DATA_MODEL_OPTIONS}
                      name="dataModel"
                      label={Messages.dataModel}
                      fullWidth
                    />
                  </span>
                  <span className={styles.wideField}>
                    <TextInputField
                      name="vendor"
                      label={Messages.vendor}
                      disabled
                      format={(vendor) => DATABASE_LABELS[vendor as Databases] || ''}
                    />
                  </span>
                  <span className={cx(styles.wideField, styles.SelectFieldWrap)}>
                    <Field name="location" validate={validators.required}>
                      {({ input }) => (
                        <div>
                          <AsyncSelectField
                            label={Messages.location}
                            isSearchable={false}
                            disabled={editing}
                            loadOptions={AddBackupModalService.loadLocationOptions}
                            defaultOptions
                            {...input}
                            className={styles.selectField}
                            data-testid="location-select-input"
                          />
                        </div>
                      )}
                    </Field>
                  </span>
                  <span className={styles.wideField}>
                    <TextareaInputField
                      fieldClassName={styles.textAreaField}
                      name="description"
                      label={Messages.description}
                    />
                  </span>
                  <span className={cx(styles.radioButtonField, styles.backupTypeField)}>
                    {values.type === BackupType.SCHEDULED && (
                      <RadioButtonGroupField
                        options={getBackupModeOptions(values.vendor)}
                        name="mode"
                        //TODO remove this when we support incremental backups for MySQL
                        disabled={editing || values.vendor === Databases.mysql}
                        label={Messages.type}
                        fullWidth
                        inputProps={{
                          onInput: (e: React.ChangeEvent<HTMLInputElement>) =>
                            form.mutators.changeDataModel(e.target.labels),
                        }}
                      />
                    )}
                  </span>
                </div>
                <div className={styles.halfPage}>
                  {values.type === BackupType.SCHEDULED && <ScheduleSection values={values} />}
                  <CollapsableSection label="Advanced Settings:" isOpen={false}>
                    <RetryModeSelector retryMode={values.retryMode} />
                  </CollapsableSection>
                  {!!backupErrors.length && <BackupErrorSection backupErrors={backupErrors} />}
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </Overlay>
  );
};

export default AddBackupPage;

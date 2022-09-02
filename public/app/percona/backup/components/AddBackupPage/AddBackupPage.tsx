import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, CustomScrollbar, LinkButton, PageToolbar, useStyles2 } from '@grafana/ui';
import { Link } from 'react-router-dom';
import {
  CheckboxField,
  LoaderButton,
  logger,
  NumberInputField,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import { Field, withTypes } from 'react-final-form';
import { AppEvents, SelectableValue, urlUtil } from '@grafana/data';
import { AddBackupFormProps, SelectableService } from './AddBackupPage.types';
import { RetryModeSelector } from './RetryModeSelector';
import { validators as customValidators } from 'app/percona/shared/helpers/validators';
import { Messages } from './AddBackupPage.messages';
import { Messages as MessagesBackup } from '../../Backup.messages';
import {
  toFormBackup,
  isCronFieldDisabled,
  PERIOD_OPTIONS,
  getBackupModeOptions,
  getDataModelFromVendor,
  isDataModelDisabled,
} from './AddBackupPage.utils';
import { AddBackupModalService } from './AddBackupPage.service';
import { ApiVerboseError, Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import {
  DATA_MODEL_OPTIONS,
  DAY_OPTIONS,
  HOUR_OPTIONS,
  MAX_RETENTION,
  MAX_VISIBLE_OPTIONS,
  MINUTE_OPTIONS,
  MIN_RETENTION,
  MONTH_OPTIONS,
  WEEKDAY_OPTIONS,
  MAX_BACKUP_NAME,
} from './AddBackupPage.constants';
import { getStyles } from './AddBackupPage.styles';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import { MultiSelectField } from 'app/percona/shared/components/Form/MultiSelectField';
import { BackupMode, BackupType, DataModel } from '../../Backup.types';
import { BackupErrorSection } from '../BackupErrorSection/BackupErrorSection';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { BackupService } from '../../Backup.service';
import { BACKUP_CANCEL_TOKEN } from '../BackupInventory/BackupInventory.constants';
import { apiErrorParser, isApiCancelError } from 'app/percona/shared/helpers/api';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { locationService } from '@grafana/runtime';
import appEvents from 'app/core/app_events';

const AddBackupPage: FC<GrafanaRouteComponentProps<{ type: string; id: string }>> = ({ match }) => {
  const scheduleMode = match.params.type === 'scheduled';
  const backup = null;
  const styles = useStyles2(getStyles);
  const [modalTitle, setModalTitle] = useState(Messages.getModalTitle(scheduleMode, !!backup));
  const initialValues = useMemo(() => toFormBackup(backup, scheduleMode), [backup, scheduleMode]);
  const { Form } = withTypes<AddBackupFormProps>();
  const editing = !!backup;

  const [backupErrors, setBackupErrors] = useState<ApiVerboseError[]>([]);
  const [generateToken] = useCancelToken();

  if (match.params.id) {
    console.log(match.params.id);
    console.log(match.params.type);
  } else {
    console.log(match.params.type);
  }

  const handleBackup = async (values: AddBackupFormProps) => {
    try {
      await BackupService.backup(values, generateToken(BACKUP_CANCEL_TOKEN));
      setBackupErrors([]);
      locationService.push('/backup/inventory');
    } catch (e) {
      if (isApiCancelError(e)) {
        locationService.push('/backup/inventory');
        return;
      }

      setBackupErrors(apiErrorParser(e));
      logger.error(e);
    }
  };

  const handleScheduledBackup = async (values: AddBackupFormProps) => {
    const { id, backupName } = values;
    try {
      await BackupService.backup(values);
      appEvents.emit(AppEvents.alertSuccess, [
        id ? MessagesBackup.scheduledBackups.getEditSuccess(backupName) : MessagesBackup.scheduledBackups.addSuccess,
      ]);
      locationService.push('/backup/scheduled');
    } catch (e) {
      logger.error(e);
    }
  };

  const handleSubmit = (values: AddBackupFormProps) => {
    if (scheduleMode) {
      handleScheduledBackup({
        ...values,
        retention: parseInt(`${values.retention}`, 10),
        retryTimes: parseInt(`${values.retryTimes}`, 10),
      });
    } else {
      handleBackup({
        ...values,
        retention: parseInt(`${values.retention}`, 10),
        retryTimes: parseInt(`${values.retryTimes}`, 10),
      });
    }
  };

  const onClose = () => {};

  useEffect(() => setModalTitle(Messages.getModalTitle(scheduleMode, editing)), [editing, scheduleMode]);

  return (
    <div>
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
              <CustomScrollbar autoHeightMin="100%" hideHorizontalTrack={true}>
                <div className={styles.contentInner}>
                  {!editing && (
                    <div className={styles.typeSelectionRow}>
                      {/* <Field name="type" component="input" type="radio" value={BackupType.DEMAND}>
                        {({ input }) => (
                          <label>
                            <input
                              {...input}
                              onChange={(e) => {
                                setModalTitle(Messages.getModalTitle(false, editing));
                                input.onChange(e);
                              }}
                            ></input>
                            {Messages.onDemand}
                          </label>
                        )}
                      </Field>
                       <Field name="type" component="input" type="radio" value={BackupType.SCHEDULED}>
                        {({ input }) => (
                          <label>
                            <input
                              {...input}
                              onChange={(e) => {
                                setModalTitle(Messages.getModalTitle(true, editing));
                                input.onChange(e);
                              }}
                            ></input>
                            {Messages.schedule}
                          </label>
                        )}
                      </Field> */}
                      <LinkButton href="/backup/demand/new" disabled={!scheduleMode}>
                        {Messages.onDemand}
                      </LinkButton>
                      <LinkButton href="/backup/scheduled/new" disabled={scheduleMode} type="button">
                        {Messages.schedule}
                      </LinkButton>
                    </div>
                  )}
                  <div className={styles.formContainer}>
                    <div className={styles.formHalf}>
                      <Field name="service" validate={validators.required}>
                        {({ input }) => (
                          <div>
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
                              data-testid="service-select-input"
                            />
                          </div>
                        )}
                      </Field>
                      <TextInputField
                        name="vendor"
                        label={Messages.vendor}
                        disabled
                        format={(vendor) => DATABASE_LABELS[vendor as Databases] || ''}
                      />
                    </div>
                    <div className={styles.formHalf}>
                      <TextInputField
                        name="backupName"
                        label={Messages.backupName}
                        validators={[validators.required, validators.maxLength(MAX_BACKUP_NAME)]}
                      />
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
                              data-testid="location-select-input"
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>
                  <RadioButtonGroupField
                    disabled={isDataModelDisabled(values)}
                    options={DATA_MODEL_OPTIONS}
                    name="dataModel"
                    label={Messages.dataModel}
                    fullWidth
                  />
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
                  {values.type !== BackupType.SCHEDULED && <RetryModeSelector retryMode={values.retryMode} />}
                  <TextareaInputField name="description" label={Messages.description} />
                  {values.type === BackupType.SCHEDULED && (
                    <div className={styles.advancedGroup} data-testid="advanced-backup-fields">
                      <h6 className={styles.advancedTitle}>{Messages.scheduleSection}</h6>
                      <div>
                        <div className={styles.advancedRow}>
                          <Field name="period" validate={validators.required}>
                            {({ input }) => (
                              <div>
                                <SelectField {...input} options={PERIOD_OPTIONS} label={Messages.every} />
                              </div>
                            )}
                          </Field>
                          <Field name="month">
                            {({ input }) => (
                              <div data-testid="multi-select-field-div-wrapper">
                                <MultiSelectField
                                  {...input}
                                  closeMenuOnSelect={false}
                                  options={MONTH_OPTIONS}
                                  label={Messages.month}
                                  isClearable
                                  placeholder={Messages.every}
                                  maxVisibleValues={MAX_VISIBLE_OPTIONS}
                                  disabled={isCronFieldDisabled(values.period!.value!, 'month')}
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className={styles.advancedRow}>
                          <Field name="day">
                            {({ input }) => (
                              <div>
                                <MultiSelectField
                                  {...input}
                                  closeMenuOnSelect={false}
                                  options={DAY_OPTIONS}
                                  label={Messages.day}
                                  isClearable
                                  placeholder={Messages.every}
                                  maxVisibleValues={MAX_VISIBLE_OPTIONS}
                                  disabled={isCronFieldDisabled(values.period!.value!, 'day')}
                                />
                              </div>
                            )}
                          </Field>
                          <Field name="weekDay">
                            {({ input }) => (
                              <div>
                                <MultiSelectField
                                  {...input}
                                  closeMenuOnSelect={false}
                                  options={WEEKDAY_OPTIONS}
                                  label={Messages.weekDay}
                                  isClearable
                                  placeholder={Messages.every}
                                  maxVisibleValues={MAX_VISIBLE_OPTIONS}
                                  disabled={isCronFieldDisabled(values.period!.value!, 'weekDay')}
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className={styles.advancedRow}>
                          <Field name="startHour">
                            {({ input }) => (
                              <div>
                                <MultiSelectField
                                  {...input}
                                  closeMenuOnSelect={false}
                                  options={HOUR_OPTIONS}
                                  label={Messages.startTime}
                                  isClearable
                                  placeholder={Messages.every}
                                  maxVisibleValues={MAX_VISIBLE_OPTIONS}
                                  disabled={isCronFieldDisabled(values.period!.value!, 'startHour')}
                                />
                              </div>
                            )}
                          </Field>
                          <Field name="startMinute">
                            {({ input }) => (
                              <div>
                                <MultiSelectField
                                  {...input}
                                  closeMenuOnSelect={false}
                                  options={MINUTE_OPTIONS}
                                  label="&nbsp;"
                                  isClearable
                                  placeholder={Messages.every}
                                  maxVisibleValues={MAX_VISIBLE_OPTIONS}
                                  disabled={isCronFieldDisabled(values.period!.value!, 'startMinute')}
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className={styles.advancedRow}>
                          <NumberInputField
                            name="retention"
                            label={Messages.retention}
                            validators={[validators.required, customValidators.range(MIN_RETENTION, MAX_RETENTION)]}
                          />
                        </div>
                        <div className={styles.advancedRow}>
                          <RetryModeSelector retryMode={values.retryMode} />
                        </div>
                        <div className={styles.advancedRow}>
                          <CheckboxField fieldClassName={styles.checkbox} name="active" label={Messages.enabled} />
                        </div>
                      </div>
                    </div>
                  )}
                  {!!backupErrors.length && <BackupErrorSection backupErrors={backupErrors} />}
                </div>
              </CustomScrollbar>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default AddBackupPage;

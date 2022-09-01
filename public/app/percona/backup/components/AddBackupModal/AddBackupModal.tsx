import {
  CheckboxField,
  LoaderButton,
  NumberInputField,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Field, withTypes } from 'react-final-form';
import { Link } from 'react-router-dom';

import { SelectableValue } from '@grafana/data';
import { Button, CustomScrollbar, PageToolbar, useStyles2 } from '@grafana/ui';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import { MultiSelectField } from 'app/percona/shared/components/Form/MultiSelectField';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { validators as customValidators } from 'app/percona/shared/helpers/validators';

import { BackupMode, BackupType, DataModel } from '../../Backup.types';
import { BackupErrorSection } from '../BackupErrorSection/BackupErrorSection';

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
} from './AddBackupModal.constants';
import { Messages } from './AddBackupModal.messages';
import { AddBackupModalService } from './AddBackupModal.service';
import { getStyles } from './AddBackupModal.styles';
import { AddBackupFormProps, AddBackupModalProps, SelectableService } from './AddBackupModal.types';
import {
  toFormBackup,
  isCronFieldDisabled,
  PERIOD_OPTIONS,
  getBackupModeOptions,
  getDataModelFromVendor,
  isDataModelDisabled,
} from './AddBackupModal.utils';
import { RetryModeSelector } from './RetryModeSelector';


const AddBackupModal: FC<AddBackupModalProps> = ({
  backup,
  isVisible,
  scheduleMode = false,
  backupErrors = [],
  onClose,
  onBackup,
}) => {
  const styles = useStyles2(getStyles);
  const [modalTitle, setModalTitle] = useState(Messages.getModalTitle(scheduleMode, !!backup));
  const initialValues = useMemo(() => toFormBackup(backup, scheduleMode), [backup, scheduleMode]);
  const { Form } = withTypes<AddBackupFormProps>();
  const editing = !!backup;

  const [queryParams] = useQueryParams();

  const returnTo: string = (queryParams['returnTo'] as string | undefined) ?? '/backup/inventory';

  const handleSubmit = (values: AddBackupFormProps) =>
    onBackup({
      ...values,
      retention: parseInt(`${values.retention}`, 10),
      retryTimes: parseInt(`${values.retryTimes}`, 10),
    });

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
                type="submit"
              >
                {Messages.getSubmitButtonText(values.type === BackupType.SCHEDULED, editing)}
              </LoaderButton>
              <Link to={returnTo}>
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
                      <Field name="type" component="input" type="radio" value={BackupType.DEMAND}>
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
                      </Field>
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

export default AddBackupModal;

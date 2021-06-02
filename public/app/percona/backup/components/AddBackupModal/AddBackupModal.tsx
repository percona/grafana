import React, { FC } from 'react';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import {
  CheckboxField,
  LoaderButton,
  Modal,
  NumberInputField,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import { Field, withTypes } from 'react-final-form';
import { AddBackupFormProps, AddBackupModalProps } from './AddBackupModal.types';
import { Messages } from './AddBackupModal.messages';
import { toFormBackup } from './AddBackupModal.utils';
import { AddBackupModalService } from './AddBackupModal.service';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import { DATA_MODEL_OPTIONS } from './AddBackupModal.constants';
import { getStyles } from './AddBackupModal.styles';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import { RetryModeSelector } from './RetryModeSelector';

export const AddBackupModal: FC<AddBackupModalProps> = ({
  backup,
  isVisible,
  scheduleMode = false,
  onClose,
  onBackup,
}) => {
  const styles = useStyles(getStyles);
  const initialValues = toFormBackup(backup);
  const { Form } = withTypes<AddBackupFormProps>();

  const handleSubmit = (values: AddBackupFormProps) => onBackup(values);

  // TODO uncomment remaining fields when we support them
  return (
    <Modal title={scheduleMode ? Messages.scheduleTitle : Messages.title} isVisible={isVisible} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, pristine, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={styles.formHalf}>
                <Field name="service" validate={validators.required}>
                  {({ input }) => (
                    <div>
                      <AsyncSelectField
                        label={Messages.serviceName}
                        isSearchable={false}
                        loadOptions={AddBackupModalService.loadServiceOptions}
                        defaultOptions
                        {...input}
                        data-qa="service-select-input"
                      />
                    </div>
                  )}
                </Field>
                <TextInputField
                  name="vendor"
                  label={Messages.vendor}
                  disabled
                  defaultValue={values.service ? DATABASE_LABELS[values.service.value?.vendor as Databases] : ''}
                />
                <RadioButtonGroupField
                  disabled
                  options={DATA_MODEL_OPTIONS}
                  name="dataModel"
                  label={Messages.dataModel}
                  fullWidth
                />
              </div>
              <div className={styles.formHalf}>
                <TextInputField name="backupName" label={Messages.backupName} validators={[validators.required]} />
                <Field name="location" validate={validators.required}>
                  {({ input }) => (
                    <div>
                      <AsyncSelectField
                        label={Messages.location}
                        isSearchable={false}
                        loadOptions={AddBackupModalService.loadLocationOptions}
                        defaultOptions
                        {...input}
                        data-qa="location-select-input"
                      />
                    </div>
                  )}
                </Field>
                {!scheduleMode && <RetryModeSelector />}
              </div>
            </div>
            <TextareaInputField name="description" label={Messages.description} />
            {scheduleMode && (
              <div className={styles.advancedGroup}>
                <h6 className={styles.advancedTitle}>Schedule</h6>
                <div>
                  <div className={styles.advancedRow}>
                    <NumberInputField label="Frequency: every" name="frequencyValue" />
                    <Field name="location" validate={validators.required}>
                      {({ input }) => (
                        <div>
                          <SelectField {...input} label="&nbsp;" name="frequencyUnit" onChange={() => {}} />
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className={styles.advancedRow}>
                    <NumberInputField label="Start at" name="startHour" />
                    <NumberInputField label="&nbsp;" name="startMinut" />
                  </div>
                  <div className={styles.advancedRow}>{scheduleMode && <RetryModeSelector />}</div>
                  <div className={styles.advancedRow}>
                    <CheckboxField fieldClassName={styles.checkbox} name="logs" label="Full logs" />
                    <CheckboxField fieldClassName={styles.checkbox} name="enable" label="Enabled" />
                  </div>
                </div>
              </div>
            )}
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="backup-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {scheduleMode ? Messages.scheduleAction : Messages.backupAction}
              </LoaderButton>
              <Button data-qa="storage-location-cancel-button" variant="secondary" onClick={onClose}>
                {Messages.cancelAction}
              </Button>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};

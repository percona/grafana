import React, { FC } from 'react';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import {
  LoaderButton,
  Modal,
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
import { DATA_MODEL_OPTIONS, RETRY_MODE_OPTIONS } from './AddBackupModal.constants';
import { getStyles } from './AddBackupModal.styles';

export const AddBackupModal: FC<AddBackupModalProps> = ({ backup, isVisible, onClose, onBackup }) => {
  const styles = useStyles(getStyles);
  const initialValues = toFormBackup(backup);
  const { Form } = withTypes<AddBackupFormProps>();

  const handleSubmit = (values: AddBackupFormProps) => onBackup(values);

  // TODO uncomment remaining fields when we support them
  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={onClose}>
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
                <RadioButtonGroupField
                  disabled
                  options={RETRY_MODE_OPTIONS}
                  name="retryMode"
                  label={Messages.retryMode}
                  fullWidth
                />
                {/* <div className={styles.retryFields}>
              <NumberInputField fieldClassName={styles.retrySelect} name="retryTimes" label={Messages.retryTimes} />
              <NumberInputField
                fieldClassName={styles.retrySelect}
                name="retryInterval"
                label={Messages.retryInterval}
              />
            </div> */}
              </div>
            </div>
            <TextareaInputField name="description" label={Messages.description} />
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="backup-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {Messages.backupAction}
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

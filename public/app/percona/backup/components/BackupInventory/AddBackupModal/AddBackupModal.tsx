import React, { FC } from 'react';
import { Button, HorizontalGroup, AsyncSelect, useStyles } from '@grafana/ui';
import {
  LoaderButton,
  Modal,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import { Field, Form } from 'react-final-form';
import { AddBackupModalProps } from './AddBackupModal.types';
import { Messages } from './AddBackupModal.messages';
import { getStyles } from './AddBackupModal.styles';
import { toFormBackup } from './AddBackupModal.utils';
import { loadServiceOptions, loadLocationOptions } from './AddBackupModal.service';
import { VENDOR_OPTIONS } from './AddBackupModal.constants';

export const AddBackupModal: FC<AddBackupModalProps> = ({ backup, isVisible, onClose }) => {
  const styles = useStyles(getStyles);
  const initialValues = toFormBackup(backup);

  const handleSubmit = () => undefined;

  // TODO uncomment remaining fields when we support them
  return (
    <Modal title="Backup On Demand" isVisible={isVisible} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => (
          <form>
            <Field name="serviceName" validate={validators.required}>
              {({ input }) => (
                <div>
                  <label className={styles.label} data-qa="service-select-label">
                    {Messages.serviceName}
                  </label>
                  <AsyncSelect
                    loadOptions={loadServiceOptions}
                    defaultOptions
                    className={styles.select}
                    {...input}
                    data-qa="service-select-input"
                  />
                </div>
              )}
            </Field>
            <RadioButtonGroupField disabled options={VENDOR_OPTIONS} name="vendor" label={Messages.vendor} fullWidth />
            {/* <RadioButtonGroupField options={dataModelOptions} name="dataModel" label={Messages.dataModel} fullWidth /> */}
            <TextInputField name="backupName" label={Messages.backupName} validators={[validators.required]} />
            <TextareaInputField name="description" label={Messages.description} />
            <Field name="location" validate={validators.required}>
              {({ input }) => (
                <div>
                  <label className={styles.label} data-qa="location-select-label">
                    {Messages.location}
                  </label>
                  <AsyncSelect
                    className={styles.select}
                    loadOptions={loadLocationOptions}
                    defaultOptions
                    {...input}
                    data-qa="location-select-input"
                  />
                </div>
              )}
            </Field>
            {/* <RadioButtonGroupField options={retryModeOptions} name="retryMode" label={Messages.retryMode} fullWidth />
            <div className={styles.retryFields}>
              <NumberInputField fieldClassName={styles.retrySelect} name="retryTimes" label={Messages.retryTimes} />
              <NumberInputField
                fieldClassName={styles.retrySelect}
                name="retryInterval"
                label={Messages.retryInterval}
              />
            </div> */}
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

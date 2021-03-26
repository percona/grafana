import React, { FC } from 'react';
import { Button, HorizontalGroup, MultiSelect, Select, useStyles } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import {
  LoaderButton,
  Modal,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import { Field, Form } from 'react-final-form';
import { DataModel } from '../BackupInventory.types';
import { AddBackupModalProps, RetryMode } from './AddBackupModal.types';
import { Messages } from './AddBackupModal.messages';
import { getStyles } from './AddBackupModal.styles';

const dataModelOptions: Array<SelectableValue<DataModel>> = [
  {
    value: DataModel.PHYSICAL,
    label: 'Physical',
  },
  {
    value: DataModel.LOGICAL,
    label: 'Logical',
  },
];

const retryModeOptions: Array<SelectableValue<RetryMode>> = [
  {
    value: RetryMode.AUTO,
    label: 'Auto',
  },
  {
    value: RetryMode.MANUAL,
    label: 'Manual',
  },
];

export const AddBackupModal: FC<AddBackupModalProps> = ({ backup, isVisible, onClose }) => {
  const styles = useStyles(getStyles);

  const handleSubmit = () => undefined;

  return (
    <Modal title="Backup On Demand" isVisible={isVisible} onClose={onClose}>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => (
          <form>
            <Field name="serviceName" validate={validators.required}>
              {({ input }) => (
                <div>
                  <label className={styles.label} data-qa="service-select-label">
                    {Messages.serviceName}
                  </label>
                  <Select className={styles.select} options={[]} {...input} data-qa="service-select-input" />
                </div>
              )}
            </Field>
            <Field name="vendor" validate={validators.required}>
              {({ input }) => (
                <div>
                  <label className={styles.label} data-qa="vendor-select-label">
                    {Messages.vendor}
                  </label>
                  <Select className={styles.select} options={[]} {...input} data-qa="vendor-select-input" />
                </div>
              )}
            </Field>
            <RadioButtonGroupField options={dataModelOptions} name="dataModel" label={Messages.dataModel} fullWidth />
            <Field name="databases" validate={validators.required}>
              {({ input }) => (
                <div>
                  <label className={styles.label} data-qa="databases-select-label">
                    {Messages.databases}
                  </label>
                  <MultiSelect className={styles.select} options={[]} {...input} data-qa="databases-select-input" />
                </div>
              )}
            </Field>
            <TextInputField name="backupName" label={Messages.backupName} validators={[validators.required]} />
            <TextareaInputField name="description" label={Messages.description} />
            <Field name="location" validate={validators.required}>
              {({ input }) => (
                <div>
                  <label className={styles.label} data-qa="location-select-label">
                    {Messages.location}
                  </label>
                  <Select className={styles.select} options={[]} {...input} data-qa="location-select-input" />
                </div>
              )}
            </Field>
            <RadioButtonGroupField options={retryModeOptions} name="retryMode" label={Messages.retryMode} fullWidth />
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

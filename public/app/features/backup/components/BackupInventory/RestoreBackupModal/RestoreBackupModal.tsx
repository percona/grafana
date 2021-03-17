import React, { FC } from 'react';
import { Button, HorizontalGroup, Select, useStyles } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { Field, withTypes } from 'react-final-form';
import { Modal, LoaderButton, RadioButtonGroupField, TextInputField, validators } from '@percona/platform-core';
import { RestoreBackupModalProps, RestoreBackupFormProps, ServiceTypeSelect } from './RestoreBackupModal.types';
import { Messages } from './RestoreBackupModal.messages';
import { getStyles } from './RestoreBackupModal.styles';

const { Form } = withTypes<RestoreBackupFormProps>();

const serviceTypeOptions: Array<SelectableValue<ServiceTypeSelect>> = [
  {
    value: ServiceTypeSelect.SAME,
    label: 'Same service',
  },
  {
    value: ServiceTypeSelect.COMPATIBLE,
    label: 'Compatible services',
  },
];

export const RestoreBackupModal: FC<RestoreBackupModalProps> = ({ backup, isVisible, onClose }) => {
  const styles = useStyles(getStyles);
  const handleSubmit = () => {};

  return (
    <Modal isVisible={isVisible} title={Messages.title} onClose={onClose}>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, pristine, submitting }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.formHalvesContainer}>
              <div>
                <RadioButtonGroupField
                  className={styles.radioGroup}
                  disabled
                  options={serviceTypeOptions}
                  name="serviceType"
                  label={Messages.serviceSelection}
                  fullWidth
                />
                <TextInputField disabled name="vendor" label={Messages.vendor} />
              </div>
              <div>
                <Field name="serviceName" validate={validators.required}>
                  {({ input }) => (
                    <div>
                      <label className={styles.label} data-qa="service-select-label">
                        {Messages.serviceName}
                      </label>
                      <Select
                        disabled={!!backup}
                        className={styles.select}
                        options={[]}
                        {...input}
                        data-qa="service-select-input"
                      />
                    </div>
                  )}
                </Field>
                <TextInputField disabled name="dataModel" label={Messages.dataModel} />
              </div>
            </div>
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="restore-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {Messages.restore}
              </LoaderButton>
              <Button data-qa="restore-cancel-button" variant="secondary" onClick={onClose}>
                {Messages.close}
              </Button>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};

import { Modal, LoaderButton, RadioButtonGroupField, TextInputField, validators } from '@percona/platform-core';
import React, { FC, useMemo } from 'react';
import { Field, withTypes } from 'react-final-form';

import { SelectableValue } from '@grafana/data';
import { Button, DateTimePicker, HorizontalGroup, useStyles } from '@grafana/ui';
import { BackupMode } from 'app/percona/backup/Backup.types';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';

import { BackupErrorSection } from '../../BackupErrorSection/BackupErrorSection';
import { BackupInventoryService } from '../BackupInventory.service';

import { Messages } from './RestoreBackupModal.messages';
import { RestoreBackupModalService } from './RestoreBackupModal.service';
import { getStyles } from './RestoreBackupModal.styles';
import { RestoreBackupModalProps, RestoreBackupFormProps, ServiceTypeSelect } from './RestoreBackupModal.types';
import { toFormProps } from './RestoreBackupModal.utils';

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

console.log(new Date('2022-10-12T11:59:09Z'));
console.log(new Date());

export const RestoreBackupModal: FC<RestoreBackupModalProps> = ({
  backup,
  isVisible,
  noService = false,
  restoreErrors = [],
  onClose,
  onRestore,
}) => {
  const styles = useStyles(getStyles);
  const initialValues = useMemo(() => (backup ? toFormProps(backup) : undefined), [backup]);
  const handleSubmit = ({ serviceType, service }: RestoreBackupFormProps) => {
    if (backup) {
      const serviceId = serviceType === ServiceTypeSelect.SAME ? backup.serviceId : service.value;
      onRestore(serviceId || '', backup.id);
    }
  };

  return (
    <Modal isVisible={isVisible} title={Messages.title} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.formHalvesContainer}>
              <div>
                <RadioButtonGroupField
                  className={styles.radioGroup}
                  options={serviceTypeOptions}
                  name="serviceType"
                  label={Messages.serviceSelection}
                  fullWidth
                  disabled={values.vendor !== DATABASE_LABELS[Databases.mysql]}
                />
                <TextInputField disabled name="vendor" label={Messages.vendor} />
                {backup!.mode === BackupMode.PITR && (
                  <>
                    <Field name="timerange">
                      {({ input }) => (
                        <div>
                          <AsyncSelectField
                            label={Messages.timeRange}
                            loadOptions={() => BackupInventoryService.listPitrTimeranges(backup!.id)}
                            {...input}
                            defaultOptions
                            data-testid="time-range-select-input"
                          />
                        </div>
                      )}
                    </Field>
                    {
                      <DateTimePicker
                        onChange={(e) => {
                          console.log(e);
                        }}
                        calendarProps={{ minDate: new Date() }}
                        timepickerProps={{
                          disabledHours: () => {
                            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 22, 23];
                          },
                          hideDisabledOptions: true,
                        }}
                      />
                    }
                  </>
                )}
                <input type="time" id="appt" name="appt" min="09" max="18:00" required />
                {JSON.stringify(values)}
              </div>
              <div>
                <Field name="service" validate={validators.required}>
                  {({ input }) => (
                    <div>
                      <AsyncSelectField
                        label={Messages.serviceName}
                        disabled={values.serviceType === ServiceTypeSelect.SAME}
                        loadOptions={() => RestoreBackupModalService.loadLocationOptions(backup!.id)}
                        defaultOptions
                        {...input}
                        data-testid="service-select-input"
                      />
                    </div>
                  )}
                </Field>

                <TextInputField disabled name="dataModel" label={Messages.dataModel} />
              </div>
            </div>

            {!!restoreErrors.length && <BackupErrorSection backupErrors={restoreErrors} />}
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-testid="restore-button"
                size="md"
                variant="primary"
                disabled={!valid || (values.serviceType === ServiceTypeSelect.SAME && noService)}
                loading={submitting}
                type="submit"
              >
                {Messages.restore}
              </LoaderButton>
              <Button data-testid="restore-cancel-button" variant="secondary" onClick={onClose}>
                {Messages.close}
              </Button>
            </HorizontalGroup>
            <div className={styles.errorLine} data-testid="backup-modal-error">
              {values.serviceType === ServiceTypeSelect.SAME && noService && Messages.noService}
            </div>
          </form>
        )}
      />
    </Modal>
  );
};

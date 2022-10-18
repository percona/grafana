import { Modal, LoaderButton, RadioButtonGroupField, TextInputField, validators } from '@percona/platform-core';
import moment from 'moment/moment';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Field, withTypes } from 'react-final-form';

import { SelectableValue, toUtc } from '@grafana/data';
import { Button, DateTimePicker, HorizontalGroup, useStyles } from '@grafana/ui';
import { BackupMode } from 'app/percona/backup/Backup.types';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';

import { BackupErrorSection } from '../../BackupErrorSection/BackupErrorSection';
import { BackupInventoryService } from '../BackupInventory.service';
import { Timeranges } from '../BackupInventory.types';

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

  const [selectedTimerange, setSelectedTimerange] = useState<Timeranges>();

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    selectedTimerange ? new Date(selectedTimerange.endTimestamp) : undefined
  );
  const calculateDisableHours = useCallback(() => {
    const disabledHours = [];

    for (let i = 0; i < 24; i++) {
      if (moment(selectedDay).isSame(selectedTimerange?.startTimestamp, 'date')) {
        if (i < moment(selectedTimerange?.startTimestamp).hours()) {
          disabledHours.push(i);
        }
      }
      if (moment(selectedDay).isSame(selectedTimerange?.endTimestamp, 'date')) {
        if (i > moment(selectedTimerange?.endTimestamp).hours()) {
          disabledHours.push(i);
        }
      }
    }

    return disabledHours;
  }, [selectedDay, selectedTimerange]);

  const calculateDisableMinutes = useCallback(
    (hour) => {
      const disabledMinutes = [];

      for (let i = 0; i < 60; i++) {
        if (
          moment(selectedDay).isSame(selectedTimerange?.startTimestamp, 'date') &&
          hour === moment(selectedTimerange?.startTimestamp).hour()
        ) {
          if (i < moment(selectedTimerange?.startTimestamp).minute()) {
            disabledMinutes.push(i);
          }
        }
        if (
          moment(selectedDay).isSame(selectedTimerange?.endTimestamp, 'date') &&
          hour === moment(selectedTimerange?.endTimestamp).hour()
        ) {
          if (i > moment(selectedTimerange?.endTimestamp).minute()) {
            disabledMinutes.push(i);
          }
        }
      }

      return disabledMinutes;
    },
    [selectedDay, selectedTimerange?.endTimestamp, selectedTimerange?.startTimestamp]
  );

  const calculateDisableSeconds = useCallback(
    (hour, minute) => {
      const disabledSeconds = [];

      for (let i = 0; i < 60; i++) {
        if (
          moment(selectedDay).isSame(selectedTimerange?.startTimestamp, 'date') &&
          hour === moment(selectedTimerange?.startTimestamp).hour() &&
          minute === moment(selectedTimerange?.startTimestamp).minute()
        ) {
          if (i < moment(selectedTimerange?.startTimestamp).second()) {
            disabledSeconds.push(i);
          }
        }
        if (
          moment(selectedDay).isSame(selectedTimerange?.endTimestamp, 'date') &&
          hour === moment(selectedTimerange?.endTimestamp).hour() &&
          minute === moment(selectedTimerange?.endTimestamp).minute()
        ) {
          if (i > moment(selectedTimerange?.endTimestamp).second()) {
            disabledSeconds.push(i);
          }
        }
      }
      return disabledSeconds;
    },
    [selectedDay, selectedTimerange]
  );

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
                            onChange={(e) => {
                              console.log(e);
                              setSelectedTimerange(e.value);
                            }}
                          />
                        </div>
                      )}
                    </Field>
                    {selectedTimerange && (
                      <DateTimePicker
                        date={toUtc(selectedTimerange.endTimestamp)}
                        onChange={(e) => {
                          console.log(e);
                        }}
                        calendarProps={{
                          minDate: new Date(selectedTimerange.startTimestamp),
                          maxDate: new Date(selectedTimerange.endTimestamp),
                          onClickDay: (e) => setSelectedDay(e),
                        }}
                        timepickerProps={{
                          disabledHours: calculateDisableHours,
                          disabledMinutes: calculateDisableMinutes,
                          disabledSeconds: calculateDisableSeconds,
                          hideDisabledOptions: true,
                        }}
                      />
                    )}
                  </>
                )}
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

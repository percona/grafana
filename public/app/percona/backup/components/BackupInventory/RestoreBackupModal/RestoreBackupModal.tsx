import { Modal, LoaderButton, RadioButtonGroupField, TextInputField, validators } from '@percona/platform-core';
import moment from 'moment/moment';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Field, withTypes } from 'react-final-form';

import { DateTime, SelectableValue, toUtc } from '@grafana/data';
import { Button, DateTimePicker, HorizontalGroup, useStyles2 } from '@grafana/ui';
import { BackupMode } from 'app/percona/backup/Backup.types';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import { Label } from 'app/percona/shared/components/Form/Label';
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

export const RestoreBackupModal: FC<RestoreBackupModalProps> = ({
  backup,
  isVisible,
  noService = false,
  restoreErrors = [],
  onClose,
  onRestore,
}) => {
  const styles = useStyles2(getStyles);
  const initialValues = useMemo(() => (backup ? toFormProps(backup) : undefined), [backup]);

  const [selectedTimerange, setSelectedTimerange] = useState<Timeranges>();
  const [selectedTimerangeFromDatepicker, setSelectedTimerangeFromDatepicker] = useState<DateTime>();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const handleSubmit = ({ serviceType, service }: RestoreBackupFormProps) => {
    if (backup && selectedTimerangeFromDatepicker) {
      const serviceId = serviceType === ServiceTypeSelect.SAME ? backup.serviceId : service.value;
      onRestore(serviceId || '', backup.id, selectedTimerangeFromDatepicker.toISOString());
    }
  };
  const calculateDisableHours = useCallback(() => {
    const disabledHours = [];

    if (selectedTimerange) {
      const { startTimestamp, endTimestamp } = selectedTimerange;
      for (let i = 0; i < 24; i++) {
        if (moment(selectedDay).isSame(startTimestamp, 'date')) {
          if (i < moment(startTimestamp).hours()) {
            disabledHours.push(i);
          }
        }
        if (moment(selectedDay).isSame(endTimestamp, 'date')) {
          if (i > moment(endTimestamp).hours()) {
            disabledHours.push(i);
          }
        }
      }
    }
    return disabledHours;
  }, [selectedDay, selectedTimerange]);

  const calculateDisableMinutes = useCallback(
    (hour) => {
      const disabledMinutes = [];
      if (selectedTimerange) {
        const { startTimestamp, endTimestamp } = selectedTimerange;
        for (let i = 0; i < 60; i++) {
          if (moment(selectedDay).isSame(startTimestamp, 'date') && hour === moment(startTimestamp).hour()) {
            if (i < moment(startTimestamp).minute()) {
              disabledMinutes.push(i);
            }
          }
          if (moment(selectedDay).isSame(endTimestamp, 'date') && hour === moment(endTimestamp).hour()) {
            if (i > moment(endTimestamp).minute()) {
              disabledMinutes.push(i);
            }
          }
        }
      }
      return disabledMinutes;
    },
    [selectedDay, selectedTimerange]
  );

  const calculateDisableSeconds = useCallback(
    (hour, minute) => {
      const disabledSeconds = [];
      if (selectedTimerange) {
        const { startTimestamp, endTimestamp } = selectedTimerange;
        for (let i = 0; i < 60; i++) {
          if (
            moment(selectedDay).isSame(startTimestamp, 'date') &&
            hour === moment(startTimestamp).hour() &&
            minute === moment(startTimestamp).minute()
          ) {
            if (i < moment(startTimestamp).second()) {
              disabledSeconds.push(i);
            }
          }
          if (
            moment(selectedDay).isSame(endTimestamp, 'date') &&
            hour === moment(endTimestamp).hour() &&
            minute === moment(endTimestamp).minute()
          ) {
            if (i > moment(endTimestamp).second()) {
              disabledSeconds.push(i);
            }
          }
        }
      }
      return disabledSeconds;
    },
    [selectedDay, selectedTimerange]
  );

  useEffect(() => {
    if (selectedTimerange) {
      const { startTimestamp, endTimestamp } = selectedTimerange;
      if (moment(selectedDay).isSame(endTimestamp, 'date')) {
        setSelectedTimerangeFromDatepicker(toUtc(endTimestamp));
      }
      if (moment(selectedDay).isSame(startTimestamp, 'date')) {
        setSelectedTimerangeFromDatepicker(toUtc(startTimestamp));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, selectedTimerange]);

  useEffect(() => {
    if (selectedTimerange) {
      const { endTimestamp } = selectedTimerange;
      setSelectedDay(new Date(endTimestamp));
      setSelectedTimerangeFromDatepicker(toUtc(endTimestamp));
    }
  }, [selectedTimerange]);

  return (
    <Modal isVisible={isVisible} title={Messages.title} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.modalWrapper}>
              {backup!.mode === BackupMode.PITR && (
                <>
                  <Field name="timerange" validate={validators.required}>
                    {({ input }) => (
                      <div>
                        <AsyncSelectField
                          label={Messages.timeRange}
                          loadOptions={() => BackupInventoryService.listPitrTimeranges(backup!.id)}
                          {...input}
                          defaultOptions
                          data-testid="time-range-select-input"
                          onChange={(e) => {
                            setSelectedTimerange(e.value);
                            input.onChange(e);
                          }}
                        />
                      </div>
                    )}
                  </Field>
                </>
              )}
              {selectedTimerange && (
                <div>
                  <Label label="test" />
                  <DateTimePicker
                    date={selectedTimerangeFromDatepicker}
                    onChange={(e) => {
                      console.log(e);
                      setSelectedTimerangeFromDatepicker(e);
                    }}
                    calendarProps={{
                      minDate: new Date(selectedTimerange.startTimestamp),
                      maxDate: new Date(selectedTimerange.endTimestamp),
                      onClickDay: (e) => {
                        console.log(e);
                        setSelectedDay(e);
                      },
                    }}
                    timepickerProps={{
                      disabledHours: calculateDisableHours,
                      disabledMinutes: calculateDisableMinutes,
                      disabledSeconds: calculateDisableSeconds,
                      hideDisabledOptions: true,
                    }}
                  />
                </div>
              )}
              <RadioButtonGroupField
                className={styles.radioGroup}
                options={serviceTypeOptions}
                name="serviceType"
                label={Messages.serviceSelection}
                fullWidth
                disabled={values.vendor !== DATABASE_LABELS[Databases.mysql]}
              />
              <TextInputField disabled name="vendor" label={Messages.vendor} />

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

import { CheckboxField, NumberInputField, SelectField, validators } from '@percona/platform-core';
import { MultiSelectField } from 'app/percona/shared/components/Form/MultiSelectField';
import React from 'react';
import { Field } from 'react-final-form';
import { Messages } from '../AddBackupPage.messages';
import { validators as customValidators } from 'app/percona/shared/helpers/validators';
import {
  DAY_OPTIONS,
  HOUR_OPTIONS,
  MAX_RETENTION,
  MAX_VISIBLE_OPTIONS,
  MINUTE_OPTIONS,
  MIN_RETENTION,
  MONTH_OPTIONS,
  WEEKDAY_OPTIONS,
} from '../AddBackupPage.constants';
import { isCronFieldDisabled, PERIOD_OPTIONS } from '../AddBackupPage.utils';
import { useStyles2 } from '@grafana/ui';
import { getStyles } from '../AddBackupPage.styles';
import { AddBackupFormProps } from '../AddBackupPage.types';
interface ScheduleSectionProps {
  values: AddBackupFormProps;
}
export const ScheduleSection = ({ values }: ScheduleSectionProps) => {
  const styles = useStyles2(getStyles);
  return (
    <div data-testid="advanced-backup-fields">
      <h6>{Messages.scheduleSection}</h6>
      <div>
        <div>
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
        <div>
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
        <div>
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
        <div>
          <NumberInputField
            name="retention"
            label={Messages.retention}
            validators={[validators.required, customValidators.range(MIN_RETENTION, MAX_RETENTION)]}
          />
        </div>
        <div>
          <CheckboxField name="active" label={Messages.enabled} />
        </div>
      </div>
    </div>
  );
};

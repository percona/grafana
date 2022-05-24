import React, { FC } from 'react';
import { RadioButtonGroupField, TextInputField } from '@percona/platform-core';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { withFilterTypes } from 'app/percona/shared/components/Elements/FilterSection/withFilterTypes';
import { ALL_VALUES_VALUE } from 'app/percona/shared/helpers/filters';
import { INTERVAL_OPTIONS, STATUS_OPTIONS } from './CheckFilters.constants';
import { Messages } from '../AllChecksTab.messages';
import { getFiltersFromUrlParams } from '../AllChecksTab.utils';

interface FormValues {
  name: string;
  status: string;
  interval: string;
  description: string;
}

export const CheckFilters: FC = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const { name, description, status, interval } = getFiltersFromUrlParams(queryParams);
  const Filters = withFilterTypes<FormValues>(
    {
      name: '',
      description: '',
      status: ALL_VALUES_VALUE,
      interval: ALL_VALUES_VALUE,
    },
    {
      name,
      description,
      status: STATUS_OPTIONS.find((opt) => opt.value === status)?.value || ALL_VALUES_VALUE,
      interval: INTERVAL_OPTIONS.find((opt) => opt.value === interval)?.value || ALL_VALUES_VALUE,
    }
  );

  const onApplyFilters = ({ name, status, interval, description }: FormValues) => {
    setQueryParams({ name, status: status, interval: interval, description });
  };

  return (
    <Filters onApply={onApplyFilters}>
      <TextInputField name="name" label={Messages.table.columns.name} />
      <TextInputField name="description" label={Messages.table.columns.description} />
      <RadioButtonGroupField fullWidth options={STATUS_OPTIONS} name="status" label={Messages.table.columns.status} />
      <RadioButtonGroupField
        fullWidth
        options={INTERVAL_OPTIONS}
        name="interval"
        label={Messages.table.columns.interval}
      />
    </Filters>
  );
};

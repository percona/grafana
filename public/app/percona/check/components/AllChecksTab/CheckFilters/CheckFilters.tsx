import React, { FC, FormEvent, useState } from 'react';
import { debounce } from 'lodash';
import { RadioButtonGroupField, TextInputField } from '@percona/platform-core';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { withFilterTypes } from 'app/percona/shared/components/Elements/FilterSection/withFilterTypes';
import { ALL_VALUES_VALUE, INPUT_DEBOUNCE_TIME_MS } from 'app/percona/shared/helpers/filters';
import { INTERVAL_OPTIONS, STATUS_OPTIONS } from './CheckFilters.constants';
import { Messages } from '../AllChecksTab.messages';
import { getFiltersFromUrlParams } from '../AllChecksTab.utils';
import { getChosenRadioOption } from 'app/percona/shared/helpers/form';

interface FormValues {
  name: string;
  status: string;
  interval: string;
  description: string;
}

export const CheckFilters: FC = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
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
      status: STATUS_OPTIONS.find((opt) => opt.value?.toLowerCase() === status)?.value || ALL_VALUES_VALUE,
      interval: INTERVAL_OPTIONS.find((opt) => opt.value?.toLowerCase() === interval)?.value || ALL_VALUES_VALUE,
    }
  );

  const onNameChanged = debounce((e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setQueryParams({ name: target.value || null });
  }, INPUT_DEBOUNCE_TIME_MS);

  const onDescriptionChanged = debounce((e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setQueryParams({ description: target.value || null });
  }, INPUT_DEBOUNCE_TIME_MS);

  const onStatusChanged = (e: FormEvent<HTMLInputElement>) => {
    const status = getChosenRadioOption(e, STATUS_OPTIONS);

    if (status) {
      setQueryParams({ status: status.value?.toLowerCase() });
    }
  };

  const onIntervalChanged = (e: FormEvent<HTMLInputElement>) => {
    const interval = getChosenRadioOption(e, INTERVAL_OPTIONS);

    if (interval) {
      setQueryParams({ interval: interval.value?.toLowerCase() });
    }
  };

  const onToggle = () => setFiltersOpen((open) => !open);

  const onClear = () => setQueryParams({ name: null, description: null, status: null, interval: null });

  return (
    <Filters showApply={false} onSectionToogle={onToggle} isOpen={filtersOpen} onClear={onClear}>
      <TextInputField
        name="name"
        label={Messages.table.columns.name}
        inputProps={{ onKeyUp: onNameChanged, autoFocus: true }}
      />
      <TextInputField
        name="description"
        label={Messages.table.columns.description}
        inputProps={{ onKeyUp: onDescriptionChanged }}
      />
      <RadioButtonGroupField
        fullWidth
        options={STATUS_OPTIONS}
        name="status"
        label={Messages.table.columns.status}
        inputProps={{ onInput: onStatusChanged }}
      />
      <RadioButtonGroupField
        fullWidth
        options={INTERVAL_OPTIONS}
        name="interval"
        label={Messages.table.columns.interval}
        inputProps={{ onInput: onIntervalChanged }}
      />
    </Filters>
  );
};

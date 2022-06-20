import { Icon, IconButton, Input, useStyles2 } from '@grafana/ui';
import { RadioButtonGroupField } from '@percona/platform-core';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import React, { useMemo, useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { FilterFieldTypes } from '..';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';
import arrayMutators from 'final-form-arrays';
import { debounce } from 'lodash';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';
import { UrlQueryValue } from '@grafana/data';

export const Filter = ({ columns, rawData, setFilteredData }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const styles = useStyles2(getStyles);
  const [queryParams, setQueryParams] = useQueryParams();

  const buildInitialValues = useMemo(() => {
    const customTransform = (params: UrlQueryValue): any => {
      if (params !== undefined && params !== null) {
        return params;
      }
      return [];
    };
    const queryKeys = columns.map((column) => ({ key: column.accessor as string, transform: customTransform }));
    queryKeys.push({ key: 'search-text-input', transform: customTransform });
    queryKeys.push({ key: 'search-select', transform: customTransform });
    const params = getValuesFromQueryParams(queryParams, queryKeys);
    return params ?? {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchColumnsOptions = useMemo(() => {
    const searchOptions = columns
      .filter((value) => FilterFieldTypes.TEXT === value.type)
      .map((column) => ({
        value: column.accessor?.toString(),
        label: column.Header?.toString(),
      }));
    searchOptions.unshift({ value: 'All', label: 'All' });
    return searchOptions;
  }, [columns]);

  const onFormChange = debounce((values: any) => {
    let obj = {};
    obj = {
      ...obj,
      'search-text-input': values['search-text-input'],
      'search-select': values['search-select']?.value ?? values['search-select'],
    };
    columns.forEach((column) => {
      const accessor = column.accessor as string;
      if (column.type === FilterFieldTypes.RADIO_BUTTON) {
        obj = { ...obj, [accessor]: values[accessor] };
      }
      if (column.type === FilterFieldTypes.DROPDOWN) {
        obj = { ...obj, [accessor]: values[accessor]?.value ? values[accessor]?.value : values[accessor] };
      }
    });
    setQueryParams(obj);
  }, 600);

  return (
    <Form
      initialValues={buildInitialValues}
      onSubmit={() => {}}
      mutators={{
        ...arrayMutators,
      }}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit} role="form">
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>Filter</span>
            <div className={styles.filterActionsWrapper}>
              <Icon name="search" size="xl" />
              <Field name="search-select">
                {({ input }) => (
                  <SelectField
                    className={styles.searchSelect}
                    options={searchColumnsOptions ?? []}
                    {...input}
                    value={input.value}
                  />
                )}
              </Field>
              <Field name="search-text-input">
                {({ input }) => <Input type="text" placeholder="Search" {...input} />}
              </Field>
              <Icon name="times" size="xl" />
              <IconButton name="filter" size="xl" onClick={() => setOpenCollapse(!openCollapse)} />
            </div>
          </div>
          <div className={openCollapse ? styles.collapseOpen : styles.collapseClose}>
            <div className={styles.advanceFilter}>
              {columns.map((column) => {
                const columnOptions = [{ value: 'All', label: 'All' }, ...(column.options ?? [])];
                if (column.type === FilterFieldTypes.DROPDOWN) {
                  return (
                    <div className={styles.advanceFilterColumn}>
                      <Field name={`${column.accessor}`}>
                        {({ input }) => (
                          <SelectField options={columnOptions} label={column.label ?? column.Header} {...input} />
                        )}
                      </Field>
                    </div>
                  );
                }
                if (column.type === FilterFieldTypes.RADIO_BUTTON) {
                  return (
                    <div className={styles.advanceFilterColumn}>
                      <RadioButtonGroupField
                        options={columnOptions}
                        name={`${column.accessor}`}
                        label={column.label ?? column.Header}
                        fullWidth
                      />
                    </div>
                  );
                }
                return <></>;
              })}
              {JSON.stringify(values)}
              <FormSpy onChange={(state) => onFormChange(state.values)}></FormSpy>
            </div>
          </div>
        </form>
      )}
    />
  );
};

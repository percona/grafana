import { IconButton, Input, useStyles2 } from '@grafana/ui';
import { RadioButtonGroupField } from '@percona/platform-core';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import React, { useEffect, useMemo, useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { FilterFieldTypes } from '..';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';
import arrayMutators from 'final-form-arrays';
import { debounce } from 'lodash';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import {
  buildEmptyValues,
  buildObjForQueryParams,
  buildSearchOptions,
  getQueryParams,
  isOtherThanTextType,
} from './Filter.utils';
import { ALL_LABEL, ALL_VALUE, SEARCH_INPUT_FIELD_NAME, SEARCH_SELECT_FIELD_NAME } from './Filter.constants';
import { FormApi } from 'final-form';

export const Filter = ({ columns }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openSearchFields, setOpenSearchFields] = useState(false);
  const styles = useStyles2(getStyles);
  const [queryParams, setQueryParams] = useQueryParams();

  const searchColumnsOptions = useMemo(() => {
    return buildSearchOptions(columns);
  }, [columns]);

  const onFormChange = debounce((values: any) => {
    const objForQueryParams = buildObjForQueryParams(columns, values);
    setQueryParams(objForQueryParams);
  }, 600);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValues = useMemo(() => getQueryParams(columns, queryParams), []);

  const onClearAll = (form: FormApi) => {
    form.initialize(buildEmptyValues(columns));
    setOpenCollapse(false);
    setOpenSearchFields(false);
  };

  useEffect(() => {
    const numberOfParams = Object.keys(initialValues).length;
    if (numberOfParams > 0 && numberOfParams <= 2) {
      if (!initialValues[SEARCH_INPUT_FIELD_NAME] && !initialValues[SEARCH_SELECT_FIELD_NAME]) {
        setOpenCollapse(true);
        setOpenSearchFields(true);
      }
    }
    if (numberOfParams > 2) {
      setOpenCollapse(true);
      setOpenSearchFields(true);
    }
    if (numberOfParams === 2) {
      if (initialValues[SEARCH_INPUT_FIELD_NAME] && initialValues[SEARCH_SELECT_FIELD_NAME]) {
        setOpenSearchFields(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAdvanceFilter = useMemo(() => {
    return isOtherThanTextType(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
      initialValues={initialValues}
      onSubmit={() => {}}
      mutators={{
        ...arrayMutators,
      }}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit} role="form">
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>Filter</span>
            <div className={styles.filterActionsWrapper}>
              <IconButton
                className={styles.icon}
                name="search"
                size="xl"
                onClick={() => setOpenSearchFields((value) => !value)}
              />
              {openSearchFields && (
                <div className={styles.searchFields}>
                  <Field name="search-select">
                    {({ input }) => (
                      <SelectField
                        defaultValue={{ value: ALL_VALUE, label: ALL_LABEL }}
                        className={styles.searchSelect}
                        options={searchColumnsOptions ?? []}
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="search-text-input">
                    {({ input }) => <Input type="text" placeholder="Search" {...input} />}
                  </Field>
                </div>
              )}
              {showAdvanceFilter && (
                <IconButton
                  className={styles.icon}
                  name="filter"
                  size="xl"
                  onClick={() => setOpenCollapse(!openCollapse)}
                />
              )}
              <IconButton className={styles.icon} name="times" size="xl" onClick={() => onClearAll(form)} />
            </div>
          </div>
          {showAdvanceFilter && (
            <div className={openCollapse ? styles.collapseOpen : styles.collapseClose}>
              <div className={styles.advanceFilter}>
                {columns.map((column) => {
                  column.options = column.options?.map((option) => ({ ...option, value: option.value?.toString() }));
                  const columnOptions = [{ value: ALL_VALUE, label: ALL_LABEL }, ...(column.options ?? [])];
                  if (column.type === FilterFieldTypes.DROPDOWN) {
                    return (
                      <div>
                        <Field name={`${column.accessor}`}>
                          {({ input }) => (
                            <SelectField
                              options={columnOptions}
                              defaultValue={{ value: ALL_VALUE, label: ALL_LABEL }}
                              label={column.label ?? column.Header}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                    );
                  }
                  if (column.type === FilterFieldTypes.RADIO_BUTTON) {
                    return (
                      <div>
                        <RadioButtonGroupField
                          options={columnOptions}
                          defaultValue={ALL_VALUE}
                          name={`${column.accessor}`}
                          label={column.label ?? column.Header}
                          fullWidth
                        />
                      </div>
                    );
                  }
                  return <></>;
                })}
              </div>
            </div>
          )}
          <FormSpy onChange={(state) => onFormChange(state.values)}></FormSpy>
        </form>
      )}
    />
  );
};

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
import { buildEmptyValues, buildObjForQueryParams, buildSearchOptions, getQueryParams } from './Filter.utils';
import { ALL_LABEL, ALL_VALUE } from './Filter.constants';
import { FormApi } from 'final-form';

export const Filter = ({ columns, rawData, setFilteredData }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
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
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={() => {}}
      mutators={{
        ...arrayMutators,
      }}
      render={({ handleSubmit, values, form }) => (
        <form onSubmit={handleSubmit} role="form">
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>Filter</span>
            <div className={styles.filterActionsWrapper}>
              <Icon name="search" size="xl" />
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

              <IconButton name="filter" size="xl" onClick={() => setOpenCollapse(!openCollapse)} />
              <IconButton name="times" size="xl" onClick={() => onClearAll(form)} />
            </div>
          </div>
          <div className={openCollapse ? styles.collapseOpen : styles.collapseClose}>
            <div className={styles.advanceFilter}>
              {columns.map((column) => {
                const columnOptions = [{ value: ALL_VALUE, label: ALL_LABEL }, ...(column.options ?? [])];
                if (column.type === FilterFieldTypes.DROPDOWN) {
                  return (
                    <div className={styles.advanceFilterColumn}>
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
                    <div className={styles.advanceFilterColumn}>
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
              <FormSpy onChange={(state) => onFormChange(state.values)}></FormSpy>
            </div>
          </div>
        </form>
      )}
    />
  );
};

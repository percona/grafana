import { Icon, IconButton, Input, useStyles2 } from '@grafana/ui';
import { RadioButtonGroupField } from '@percona/platform-core';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import React, { useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FilterFieldTypes } from '..';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';
import arrayMutators from 'final-form-arrays';

export const Filter = ({ columns, rawData, setFilteredData }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const styles = useStyles2(getStyles);

  const searchColumnsOptions = useMemo(() => {
    const searchOptions = columns
      .filter((value) => FilterFieldTypes.TEXT === value.type)
      .map((column) => ({
        value: column.accessor?.toString(),
        label: column.Header?.toString(),
      }));
    searchOptions.unshift({ value: '', label: 'All' });
    return searchOptions;
  }, [columns]);

  const all = [{ value: '', label: 'All' }, ...searchColumnsOptions];
  console.log(all);
  return (
    <Form
      initialValues={{}}
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
                  <SelectField className={styles.searchSelect} options={searchColumnsOptions ?? []} {...input} />
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
                if (column.type === FilterFieldTypes.DROPDOWN) {
                  return (
                    <div className={styles.advanceFilterColumn}>
                      <Field name={`${column.accessor}`}>
                        {({ input }) => (
                          <SelectField
                            options={column.options ?? []}
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
                        options={column.options ?? []}
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
            </div>
          </div>
        </form>
      )}
    />
  );
};

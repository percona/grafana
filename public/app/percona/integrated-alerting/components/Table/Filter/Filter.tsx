import { Icon, IconButton, useStyles2 } from '@grafana/ui';
import { TextInputField } from '@percona/platform-core';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import { debounce } from 'lodash';
import React, { FormEvent, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FilterFieldTypes } from '..';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';

export const Filter = ({ columns, rawData, setFilteredData }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const styles = useStyles2(getStyles);
  const [searchValue, setSearchValue] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const textColumns = columns.filter((value) => FilterFieldTypes.TEXT === value.type);

  const searchColumnsOptions = textColumns.map((column) => ({
    value: column.accessor?.toString(),
    label: column.Header?.toString(),
  }));

  useEffect(() => {
    const dataArray = rawData.filter((filterValue) => isValueInColumn(filterValue));
    setFilteredData(dataArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, searchValue]);

  const isValueInColumn = (filterValue: Object) => {
    let result = false;
    textColumns.forEach((column) => {
      if (column.accessor === selectedColumn || selectedColumn === '') {
        // @ts-ignore
        if (isTextIncluded(searchValue, filterValue[column.accessor])) {
          result = true;
          return;
        }
      }
    });
    return result;
  };

  const onNameChanged = debounce((e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setSearchValue(target.value);
    console.log(e);
  }, 600);

  const isTextIncluded = (needle: string, haystack: string): boolean =>
    haystack.toLowerCase().includes(needle.toLowerCase());

  return (
    <Form
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} role="form">
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>Filter</span>
            <div className={styles.filterActionsWrapper}>
              <Icon name="search" size="xl" />
              <Field name="template">
                {({ input }) => (
                  <SelectField
                    options={searchColumnsOptions}
                    {...input}
                    onChange={(name) => {
                      setSelectedColumn(name.value);
                      input.onChange(name);
                    }}
                    value={selectedColumn}
                    data-testid="template-select-input"
                  />
                )}
              </Field>
              <TextInputField
                name="name"
                placeholder="Search"
                value={searchValue}
                inputProps={{ onKeyUp: onNameChanged }}
              />
              <Icon name="times" size="xl" />
              <IconButton name="filter" size="xl" onClick={() => setOpenCollapse(!openCollapse)} />
            </div>
          </div>
          <div className={openCollapse ? styles.collapseOpen : styles.collapseClose}>
            <div className={styles.collapseBody}>Test</div>
          </div>
        </form>
      )}
      onSubmit={() => {}}
    />
  );
};

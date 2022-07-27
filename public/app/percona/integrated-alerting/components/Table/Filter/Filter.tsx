/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormApi } from 'final-form';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Form, FormSpy } from 'react-final-form';

import { IconButton, useStyles2 } from '@grafana/ui';
import { useQueryParams } from 'app/core/hooks/useQueryParams';

import { FilterFieldTypes } from '..';

import { DEBOUNCE_DELAY, SEARCH_INPUT_FIELD_NAME, SEARCH_SELECT_FIELD_NAME } from './Filter.constants';
import { Messages } from './Filter.messages';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';
import {
  buildEmptyValues,
  buildObjForQueryParams,
  buildSearchOptions,
  getQueryParams,
  isInOptions,
  isOtherThanTextType,
  isValueInTextColumn,
} from './Filter.utils';
import { RadioButtonField } from './components/fields/RadioButtonField';
import { SearchTextField } from './components/fields/SearchTextField';
import { SelectColumnField } from './components/fields/SelectColumnField';
import { SelectDropdownField } from './components/fields/SelectDropdownField';

export const Filter = ({ columns, rawData, setFilteredData, hasBackendFiltering = false }: FilterProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openSearchFields, setOpenSearchFields] = useState(false);
  const styles = useStyles2(getStyles);
  const [queryParams, setQueryParams] = useQueryParams();

  const searchColumnsOptions = useMemo(() => buildSearchOptions(columns), [columns]);

  const onFormChange = debounce(
    (values: Record<string, any>) => setQueryParams(buildObjForQueryParams(columns, values)),
    DEBOUNCE_DELAY
  );
  const onSubmit = (values: Record<string, any>) => {
    setQueryParams(buildObjForQueryParams(columns, values));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValues = useMemo(() => getQueryParams(columns, queryParams), []);
  const onClearAll = (form: FormApi) => {
    form.initialize(buildEmptyValues(columns));
    setOpenCollapse(false);
    setOpenSearchFields(false);
  };

  useEffect(() => {
    const numberOfParams = Object.keys(initialValues).length;
    if (
      numberOfParams > 0 &&
      numberOfParams <= 2 &&
      !initialValues[SEARCH_INPUT_FIELD_NAME] &&
      !initialValues[SEARCH_SELECT_FIELD_NAME]
    ) {
      setOpenCollapse(true);
    }
    if (numberOfParams > 2) {
      setOpenCollapse(true);
      setOpenSearchFields(true);
    }
    if (numberOfParams === 2 && initialValues[SEARCH_INPUT_FIELD_NAME] && initialValues[SEARCH_SELECT_FIELD_NAME]) {
      setOpenSearchFields(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const queryParamsObj = getQueryParams(columns, queryParams);
    if (Object.keys(queryParams).length > 0 && !hasBackendFiltering) {
      const dataArray = rawData.filter(
        (filterValue) =>
          isValueInTextColumn(columns, filterValue, queryParamsObj) &&
          isInOptions(columns, filterValue, queryParamsObj, FilterFieldTypes.DROPDOWN) &&
          isInOptions(columns, filterValue, queryParamsObj, FilterFieldTypes.RADIO_BUTTON)
      );
      setFilteredData(dataArray);
    } else {
      setFilteredData(rawData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, rawData]);

  const showAdvanceFilter = useMemo(
    () => isOtherThanTextType(columns),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => (
        <form
          onSubmit={handleSubmit}
          role="form"
          onKeyPress={(e) => {
            e.key === 'Enter' && e.preventDefault();
          }}
        >
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel} data-testid="filter">
              {Messages.filterLabel}
            </span>
            <div className={styles.filterActionsWrapper}>
              <IconButton
                className={styles.icon}
                name="search"
                size="xl"
                onClick={() => setOpenSearchFields((value) => !value)}
                data-testid="open-search-fields"
              />
              {openSearchFields && (
                <div className={styles.searchFields}>
                  <SelectColumnField searchColumnsOptions={searchColumnsOptions} />
                  <SearchTextField />
                </div>
              )}
              {showAdvanceFilter && (
                <IconButton
                  className={styles.icon}
                  name="filter"
                  size="xl"
                  onClick={() => setOpenCollapse((open) => !open)}
                  data-testid="advance-filter-button"
                />
              )}
              <IconButton
                className={styles.icon}
                name="times"
                size="xl"
                onClick={() => onClearAll(form)}
                data-testid="clear-all-button"
              />
              {hasBackendFiltering && (
                <IconButton className={styles.icon} name="check" size="xl" type="submit" data-testid="submit-button" />
              )}
            </div>
          </div>
          {showAdvanceFilter && openCollapse && (
            <div className={styles.advanceFilter}>
              {columns.map(
                (column) =>
                  (column.type === FilterFieldTypes.DROPDOWN && <SelectDropdownField column={column} />) ||
                  (column.type === FilterFieldTypes.RADIO_BUTTON && <RadioButtonField column={column} />)
              )}
            </div>
          )}
          {!hasBackendFiltering && <FormSpy onChange={(state) => onFormChange(state.values)}></FormSpy>}
        </form>
      )}
    />
  );
};

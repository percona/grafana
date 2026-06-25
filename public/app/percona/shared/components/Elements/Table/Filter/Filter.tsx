/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion */
import { cx } from '@emotion/css';
import { FormApi } from 'final-form';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, FormSpy } from 'react-final-form';

import { t } from '@grafana/i18n';
import { IconButton, useStyles2 } from '@grafana/ui';
import { useQueryParams } from 'app/core/hooks/useQueryParams';

import { FilterFieldTypes } from '..';

import { DEBOUNCE_DELAY } from './Filter.constants';
import { Messages } from './Filter.messages';
import { getStyles } from './Filter.styles';
import { FilterProps } from './Filter.types';
import {
  buildEmptyValues,
  buildParamsFromKey,
  buildSearchOptions,
  getFilteredData,
  getFilterPanelStateFromUrl,
  getFormValuesFromUrl,
  getQueryParams,
  isSameFilterQueryState,
  isOtherThanTextType,
} from './Filter.utils';
import BooleanField from './components/fields/BooleanField';
import { RadioButtonField } from './components/fields/RadioButtonField';
import { SearchTextField } from './components/fields/SearchTextField';
import { SelectColumnField } from './components/fields/SelectColumnField';
import { SelectDropdownField } from './components/fields/SelectDropdownField';

export const Filter = <T,>({
  columns,
  rawData,
  setFilteredData,
  hasBackendFiltering = false,
  tableKey,
}: FilterProps<T>) => {
  const styles = useStyles2(getStyles);
  const [queryParams, setQueryParams] = useQueryParams();

  const queryParamsByKey = useMemo(() => {
    if (tableKey) {
      // eslint-disable-next-line
      const params = queryParams[tableKey] as any;

      if (params) {
        const paramsObj = JSON.parse(params);
        return paramsObj;
      } else {
        return {};
      }
    }
    return queryParams;
  }, [queryParams, tableKey]);

  const [openCollapse, setOpenCollapse] = useState(
    () => getFilterPanelStateFromUrl(columns, queryParamsByKey).openCollapse
  );
  const [openSearchFields, setOpenSearchFields] = useState(
    () => getFilterPanelStateFromUrl(columns, queryParamsByKey).openSearchFields
  );

  const searchColumnsOptions = useMemo(() => buildSearchOptions(columns), [columns]);

  const updateQueryParams = useCallback(
    (values: Record<string, any>, replace = true) => {
      const currentUrlValues = getFormValuesFromUrl(columns, queryParamsByKey);
      if (isSameFilterQueryState(columns, values, currentUrlValues)) {
        return;
      }

      setQueryParams(buildParamsFromKey(tableKey, columns, values), replace);
    },
    [setQueryParams, tableKey, columns, queryParamsByKey]
  );

  const onFormChange = useMemo(
    () => debounce((values: Record<string, any>) => updateQueryParams(values, true), DEBOUNCE_DELAY),
    [updateQueryParams]
  );

  useEffect(() => {
    return () => onFormChange.cancel();
  }, [onFormChange]);

  const onSubmit = useCallback(
    (values: Record<string, any>) => {
      updateQueryParams(values, false);
    },
    [updateQueryParams]
  );

  const initialValues = useMemo(() => getFormValuesFromUrl(columns, queryParamsByKey), [columns, queryParamsByKey]);
  const onClearAll = (form: FormApi) => {
    form.initialize(buildEmptyValues(columns));
    setOpenCollapse(false);
    setOpenSearchFields(false);
  };

  useEffect(() => {
    const { openCollapse: openAdvanced, openSearchFields: openSearch } = getFilterPanelStateFromUrl(
      columns,
      queryParamsByKey
    );

    if (openAdvanced) {
      setOpenCollapse(true);
    }
    if (openSearch) {
      setOpenSearchFields(true);
    }
  }, [columns, queryParamsByKey]);

  useEffect(() => {
    const queryParamsObj = getQueryParams(columns, queryParamsByKey);
    if (Object.keys(queryParamsByKey).length > 0 && !hasBackendFiltering) {
      const dataArray = getFilteredData(rawData, columns, queryParamsObj);
      setFilteredData(dataArray);
    } else {
      setFilteredData(rawData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParamsByKey, rawData]);

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
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <form
          onSubmit={handleSubmit}
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
                aria-label={t('percona.table-filter.open-search-fields', 'Open search fields')}
              />
              {openSearchFields && (
                <div className={styles.searchFields}>
                  <SelectColumnField searchColumnsOptions={searchColumnsOptions} />
                  <SearchTextField />
                </div>
              )}
              {showAdvanceFilter && (
                <IconButton
                  aria-label={t('percona.table-filter.toggle-advanced-filter', 'Toggle advanced filter')}
                  className={styles.icon}
                  name="filter"
                  size="xl"
                  onClick={() => setOpenCollapse((open) => !open)}
                  data-testid="advance-filter-button"
                />
              )}
              <IconButton
                aria-label={t('percona.table-filter.clear-filter', 'Clear filter')}
                className={styles.icon}
                name="times"
                size="xl"
                onClick={() => onClearAll(form)}
                data-testid="clear-all-button"
              />
              {hasBackendFiltering && (
                <IconButton
                  // todo: add aria-label
                  aria-label=""
                  className={styles.icon}
                  name="check"
                  size="xl"
                  type="submit"
                  data-testid="submit-button"
                />
              )}
            </div>
          </div>
          {showAdvanceFilter && openCollapse && (
            <div className={cx(styles.advanceFilter, columns.length % 3 === 0 && styles.advancedFilter3Columns)}>
              {columns.map(
                (column) =>
                  (column.type === FilterFieldTypes.DROPDOWN && <SelectDropdownField column={column} />) ||
                  (column.type === FilterFieldTypes.BOOLEAN && <BooleanField column={column} />) ||
                  (column.type === FilterFieldTypes.RADIO_BUTTON && <RadioButtonField column={column} />)
              )}
            </div>
          )}
          {!hasBackendFiltering && (
            <FormSpy
              subscription={{
                values: true,
              }}
              onChange={(state) => onFormChange(state.values)}
            ></FormSpy>
          )}
        </form>
      )}
    />
  );
};

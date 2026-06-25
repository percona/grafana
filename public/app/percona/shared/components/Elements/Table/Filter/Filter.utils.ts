import { UrlQueryMap, UrlQueryValue } from '@grafana/data';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';

import { ExtendedColumn, FilterFieldTypes } from '..';

import { ALL_LABEL, ALL_VALUE, SEARCH_INPUT_FIELD_NAME, SEARCH_SELECT_FIELD_NAME } from './Filter.constants';
import { FilterFormValues } from './Filter.types';

export const getQueryParams = <T extends object>(columns: Array<ExtendedColumn<T>>, queryParams: UrlQueryMap) => {
  const customTransform = (params: UrlQueryValue): string | undefined => {
    if (params !== undefined && params !== null) {
      return params.toString();
    }
    return undefined;
  };
  const queryKeys = columns.map((column) => ({ key: column.accessor as string, transform: customTransform }));
  queryKeys.push({ key: SEARCH_INPUT_FIELD_NAME, transform: customTransform });
  queryKeys.push({ key: SEARCH_SELECT_FIELD_NAME, transform: customTransform });
  const params = getValuesFromQueryParams(queryParams, queryKeys);
  return params ?? {};
};

export const buildObjForQueryParams = <T extends object>(
  columns: Array<ExtendedColumn<T>>,
  values: FilterFormValues
) => {
  const resolveFieldValue = (value: FilterFormValues[string]) => {
    if (value !== null && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    return value;
  };

  const searchInputValue = values[SEARCH_INPUT_FIELD_NAME];
  const searchSelectValue = resolveFieldValue(values[SEARCH_SELECT_FIELD_NAME]);

  let obj: FilterFormValues = {
    [SEARCH_INPUT_FIELD_NAME]: searchInputValue || undefined,
    [SEARCH_SELECT_FIELD_NAME]: undefined,
  };

  if (searchInputValue) {
    const resolvedSelectValue = searchSelectValue ?? ALL_VALUE;
    if (resolvedSelectValue !== ALL_VALUE) {
      obj[SEARCH_SELECT_FIELD_NAME] = resolvedSelectValue.toString();
    }
  }

  columns.forEach((column) => {
    const accessor = column.accessor as string;
    const value = resolveFieldValue(values[accessor]);

    if (column.type === FilterFieldTypes.BOOLEAN) {
      // Omit from query params if value is false
      obj[accessor] = value ? 'true' : undefined;
    } else if (value) {
      if (column.type === FilterFieldTypes.RADIO_BUTTON || column.type === FilterFieldTypes.DROPDOWN) {
        obj[accessor] = value === ALL_VALUE ? undefined : value.toString();
      }
    }
  });

  return obj;
};

export const buildParamsFromKey = <T extends object>(
  tableKey: string | undefined,
  columns: Array<ExtendedColumn<T>>,
  values: FilterFormValues
) => {
  const params = buildObjForQueryParams(columns, values);
  if (tableKey) {
    const paramsResult = Object.values(params).some((value) => value !== undefined);
    if (paramsResult) {
      return { [tableKey]: JSON.stringify(params) };
    }
    return { [tableKey]: undefined };
  }
  return params;
};

export const getFormValuesFromUrl = <T extends object>(
  columns: Array<ExtendedColumn<T>>,
  queryParams: UrlQueryMap
): FilterFormValues => ({
  ...buildEmptyValues(columns),
  ...getQueryParams(columns, queryParams),
});

export const serializeFilterQueryState = <T extends object>(
  columns: Array<ExtendedColumn<T>>,
  values: FilterFormValues
): string => {
  const params = buildObjForQueryParams(columns, values);
  const normalized: Record<string, string> = {};

  Object.keys(params)
    .sort()
    .forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        normalized[key] = value.toString();
      }
    });

  return JSON.stringify(normalized);
};

export const buildSearchOptions = <T extends object>(columns: Array<ExtendedColumn<T>>) => {
  const searchOptions = columns
    .filter((value) => value.type === FilterFieldTypes.TEXT)
    .map((column) => ({
      value: column.accessor?.toString(),
      label: column.Header?.toString(),
    }));
  searchOptions.unshift({ value: ALL_VALUE, label: ALL_LABEL });
  return searchOptions;
};

export const buildEmptyValues = <T extends object>(columns: Array<ExtendedColumn<T>>) => {
  let obj = {
    [SEARCH_INPUT_FIELD_NAME]: undefined,
    [SEARCH_SELECT_FIELD_NAME]: ALL_VALUE,
  };
  columns.map((column) => {
    if (column.type === FilterFieldTypes.DROPDOWN || column.type === FilterFieldTypes.RADIO_BUTTON) {
      obj = { ...obj, [column.accessor as string]: ALL_VALUE };
    } else if (column.type === FilterFieldTypes.BOOLEAN) {
      obj = { ...obj, [column.accessor as string]: undefined };
    }
  });
  return obj;
};

export const isValueInTextColumn = <T extends object>(
  columns: Array<ExtendedColumn<T>>,
  filterValue: T,
  queryParamsObj: Record<string, string>
) => {
  const searchInputValue = queryParamsObj[SEARCH_INPUT_FIELD_NAME];
  const selectColumnValue = queryParamsObj[SEARCH_SELECT_FIELD_NAME];
  const searchAllColumns = !selectColumnValue || selectColumnValue === ALL_VALUE;
  let result = false;
  columns.forEach((column) => {
    if (column.type === FilterFieldTypes.TEXT) {
      if (searchInputValue) {
        if (
          (column.accessor === selectColumnValue || searchAllColumns) &&
          isTextIncluded(searchInputValue, filterValue[column.accessor as keyof T] as string | number)
        ) {
          result = true;
        }
      } else {
        result = true;
      }
    }
  });
  return result;
};

export const isTextIncluded = (needle: string, haystack: string | number | undefined | null): boolean =>
  haystack != null && haystack.toString().toLowerCase().includes(needle.toLowerCase());

export const isInOptions = <T extends object>(
  columns: Array<ExtendedColumn<T>>,
  filterValue: T,
  queryParamsObj: Record<string, string>,
  filterFieldType: FilterFieldTypes
) => {
  let result: boolean[] = [];

  columns.forEach((column) => {
    const accessor = column.accessor;
    const queryParamValueAccessor = queryParamsObj[accessor as string];
    const filterValueAccessor = filterValue[accessor as keyof T];
    if (column.type === filterFieldType) {
      if (queryParamValueAccessor) {
        if (queryParamValueAccessor.toLowerCase() === filterValueAccessor?.toString().toLowerCase()) {
          result.push(true);
        } else {
          result.push(false);
        }
      } else {
        result.push(true);
      }
    }
  });
  return result.every((value) => value);
};

export const isBooleanMatch = <T extends object>(
  columns: Array<ExtendedColumn<T>>,
  filterValue: T,
  queryParamsObj: Record<string, string>
) => {
  const result: boolean[] = [];

  columns.forEach((column) => {
    const accessor = column.accessor;
    const queryParamValueAccessor = queryParamsObj[accessor as string];
    const filterValueAccessor = filterValue[accessor as keyof T];

    if (column.type === FilterFieldTypes.BOOLEAN) {
      if (queryParamValueAccessor) {
        const filterBoolean = queryParamValueAccessor === 'true';
        const rowValue = filterValueAccessor;

        // Only filter out if the filter value is true
        if (filterBoolean) {
          result.push(rowValue === true);
        }
      }
    }
  });
  return result.every((value) => value);
};

export const isOtherThanTextType = <T extends object>(columns: Array<ExtendedColumn<T>>): boolean =>
  columns.some((column) => column.type !== undefined && column.type !== FilterFieldTypes.TEXT);

export const buildColumnOptions = <T extends object>(column: ExtendedColumn<T>) => {
  column.options = column.options?.map((option) => ({ ...option, value: option.value?.toString() }));
  return [{ value: ALL_VALUE, label: ALL_LABEL }, ...(column.options ?? [])];
};

export const getFilteredData = <T extends object>(
  rawData: T[],
  columns: Array<ExtendedColumn<T>>,
  queryParamsObj: Record<string, string>
) =>
  rawData.filter(
    (filterValue) =>
      isValueInTextColumn(columns, filterValue, queryParamsObj) &&
      isInOptions(columns, filterValue, queryParamsObj, FilterFieldTypes.DROPDOWN) &&
      isInOptions(columns, filterValue, queryParamsObj, FilterFieldTypes.RADIO_BUTTON) &&
      isBooleanMatch(columns, filterValue, queryParamsObj)
  );

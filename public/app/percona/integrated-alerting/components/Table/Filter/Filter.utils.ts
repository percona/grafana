import { UrlQueryMap, UrlQueryValue } from '@grafana/data';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';
import { ExtendedColumn, FilterFieldTypes } from '..';
import { ALL_LABEL, ALL_VALUE, SEARCH_INPUT_FIELD_NAME, SEARCH_SELECT_FIELD_NAME } from './Filter.constants';

export const getQueryParams = (columns: ExtendedColumn[], queryParams: UrlQueryMap) => {
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

export const buildObjForQueryParams = (columns: ExtendedColumn[], values: Record<string, any>) => {
  let obj: Record<string, any> = {
    [SEARCH_INPUT_FIELD_NAME]: values[SEARCH_INPUT_FIELD_NAME],
    [SEARCH_SELECT_FIELD_NAME]: values[SEARCH_SELECT_FIELD_NAME]?.value ?? values[SEARCH_SELECT_FIELD_NAME],
  };
  const searchSelectValue = obj[SEARCH_SELECT_FIELD_NAME];
  const searchInputValue = obj[SEARCH_INPUT_FIELD_NAME];

  if (searchInputValue) {
    obj[SEARCH_SELECT_FIELD_NAME] = searchSelectValue ?? ALL_VALUE;
  } else if (searchSelectValue) {
    obj[SEARCH_SELECT_FIELD_NAME] = undefined;
  }

  columns.forEach((column) => {
    const accessor = column.accessor as string;
    const value = values[accessor]?.value ?? values[accessor];

    if (value) {
      if (column.type === FilterFieldTypes.RADIO_BUTTON || column.type === FilterFieldTypes.DROPDOWN) {
        obj[accessor] = value === ALL_VALUE ? undefined : value.toString();
      }
    }
  });
  return obj;
};

export const buildSearchOptions = (columns: ExtendedColumn[]) => {
  const searchOptions = columns
    .filter((value) => FilterFieldTypes.TEXT === value.type)
    .map((column) => ({
      value: column.accessor?.toString(),
      label: column.Header?.toString(),
    }));
  searchOptions.unshift({ value: ALL_VALUE, label: ALL_LABEL });
  return searchOptions;
};

export const buildEmptyValues = (columns: ExtendedColumn[]) => {
  let obj = {
    [SEARCH_INPUT_FIELD_NAME]: undefined,
    [SEARCH_SELECT_FIELD_NAME]: ALL_VALUE,
  };
  columns.map((column) => {
    if (column.type === FilterFieldTypes.DROPDOWN || column.type === FilterFieldTypes.RADIO_BUTTON) {
      obj = { ...obj, [column.accessor as string]: ALL_VALUE };
    }
  });
  return obj;
};

export const isValueInTextColumn = (
  columns: ExtendedColumn[],
  filterValue: any,
  queryParamsObj: { [key: keyof UrlQueryMap]: string }
) => {
  let result = false;
  columns.forEach((column) => {
    if (column.type === FilterFieldTypes.TEXT) {
      if (queryParamsObj[SEARCH_INPUT_FIELD_NAME]) {
        if (
          column.accessor === queryParamsObj[SEARCH_SELECT_FIELD_NAME] ||
          queryParamsObj[SEARCH_SELECT_FIELD_NAME] === ALL_VALUE
        ) {
          if (isTextIncluded(queryParamsObj[SEARCH_INPUT_FIELD_NAME], filterValue[column.accessor as string])) {
            result = true;
            return;
          }
        }
      } else {
        result = true;
      }
    }
  });
  return result;
};

export const isTextIncluded = (needle: string, haystack: string): boolean =>
  haystack.toLowerCase().includes(needle.toLowerCase());

export const isInOptions = (
  columns: ExtendedColumn[],
  filterValue: any,
  queryParamsObj: { [key: keyof UrlQueryMap]: string },
  filter: FilterFieldTypes
) => {
  let result: boolean[] = [];

  columns.forEach((column) => {
    const accessor = column.accessor as string;

    if (column.type === filter) {
      if (queryParamsObj[accessor]) {
        if (queryParamsObj[accessor]?.toLowerCase() === filterValue[accessor]?.toString().toLowerCase()) {
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

export const isOtherThanTextType = (columns: ExtendedColumn[]) => {
  return columns.find((column) => {
    return column.type !== undefined && column.type !== FilterFieldTypes.TEXT;
  })
    ? true
    : false;
};

export const buildColumnOptions = (column: ExtendedColumn) => {
  column.options = column.options?.map((option) => ({ ...option, value: option.value?.toString() }));
  return [{ value: ALL_VALUE, label: ALL_LABEL }, ...(column.options ?? [])];
};

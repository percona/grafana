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
  if (obj[SEARCH_INPUT_FIELD_NAME] && !obj[SEARCH_SELECT_FIELD_NAME]) {
    obj[SEARCH_SELECT_FIELD_NAME] = ALL_VALUE;
  }
  if (!obj[SEARCH_INPUT_FIELD_NAME] && obj[SEARCH_SELECT_FIELD_NAME]) {
    obj[SEARCH_SELECT_FIELD_NAME] = undefined;
  }
  columns.forEach((column) => {
    const accessor = column.accessor as string;

    if (column.type === FilterFieldTypes.RADIO_BUTTON) {
      if (values[accessor]) {
        if (values[accessor] === ALL_VALUE) {
          obj[accessor] = undefined;
        } else {
          obj[accessor] = values[accessor].toString();
        }
      }
    }
    if (column.type === FilterFieldTypes.DROPDOWN) {
      if (values[accessor]) {
        if (values[accessor]?.value === ALL_VALUE || values[accessor] === ALL_VALUE) {
          obj[accessor] = undefined;
        } else {
          obj[accessor] = values[accessor]?.value ? values[accessor]?.value.toString() : values[accessor].toString();
        }
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
  let result = false;
  columns.forEach((column) => {
    if (column.type !== undefined && column.type !== FilterFieldTypes.TEXT) {
      result = true;
    }
  });
  return result;
};

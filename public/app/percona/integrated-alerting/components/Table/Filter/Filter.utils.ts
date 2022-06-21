import { UrlQueryMap, UrlQueryValue } from '@grafana/data';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';
import { ExtendedColumn, FilterFieldTypes } from '..';
import { SEARCH_INPUT_FIELD_NAME, SEARCH_SELECT_FIELD_NAME } from './Filter.constants';

export const getQueryParams = (columns: ExtendedColumn[], queryParams: UrlQueryMap) => {
  const customTransform = (params: UrlQueryValue): any => {
    if (params !== undefined && params !== null) {
      return params;
    }
    return [];
  };
  const queryKeys = columns.map((column) => ({ key: column.accessor as string, transform: customTransform }));
  queryKeys.push({ key: SEARCH_INPUT_FIELD_NAME, transform: customTransform });
  queryKeys.push({ key: SEARCH_SELECT_FIELD_NAME, transform: customTransform });
  const params = getValuesFromQueryParams(queryParams, queryKeys);
  return params ?? {};
};

export const buildObjForQueryParams = (columns: ExtendedColumn[], values: any) => {
  let obj = {
    [SEARCH_INPUT_FIELD_NAME]: values[SEARCH_INPUT_FIELD_NAME],
    [SEARCH_SELECT_FIELD_NAME]: values[SEARCH_SELECT_FIELD_NAME]?.value ?? values[SEARCH_SELECT_FIELD_NAME],
  };
  if (obj[SEARCH_INPUT_FIELD_NAME] && !obj[SEARCH_SELECT_FIELD_NAME]) {
    obj = {
      ...obj,
      [SEARCH_SELECT_FIELD_NAME]: 'All',
    };
  }
  columns.forEach((column) => {
    const accessor = column.accessor as string;
    if (column.type === FilterFieldTypes.RADIO_BUTTON) {
      obj = { ...obj, [accessor]: values[accessor] };
    }
    if (column.type === FilterFieldTypes.DROPDOWN) {
      obj = { ...obj, [accessor]: values[accessor]?.value ?? values[accessor] };
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
  searchOptions.unshift({ value: 'All', label: 'All' });
  return searchOptions;
};

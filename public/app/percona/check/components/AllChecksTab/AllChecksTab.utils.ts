import { UrlQueryMap } from '@grafana/data';
import { ALL_VALUES_VALUE } from 'app/percona/shared/helpers/filters';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';

export const getFiltersFromUrlParams = (queryParams: UrlQueryMap) => {
  const params = getValuesFromQueryParams<[string, string, string, string]>(queryParams, [
    { key: 'name' },
    { key: 'description' },
    { key: 'status' },
    { key: 'interval' },
  ]);
  const [name = '', description = ''] = params;
  const status = params[2] || ALL_VALUES_VALUE;
  const interval = params[3] || ALL_VALUES_VALUE;

  return { name, description, status, interval };
};

import { UrlQueryMap } from '@grafana/data';
import { ALL_VALUES_VALUE } from 'app/percona/shared/helpers/filters';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';
import { CheckDetails } from '../../types';

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

export const updateChecksUIState = (check: CheckDetails, checks: CheckDetails[]) => {
  const { name, disabled, interval } = check;

  return checks.map((oldCheck) => {
    if (oldCheck.name !== name) {
      return oldCheck;
    }

    return { ...oldCheck, disabled, interval };
  });
};

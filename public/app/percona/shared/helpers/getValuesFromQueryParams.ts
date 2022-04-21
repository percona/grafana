import { UrlQueryMap } from '@grafana/data';

export const getValuesFromQueryParams = (
  queryParams: UrlQueryMap,
  ...keys: string[]
): Record<string, string[] | undefined> => {
  const result: Record<string, string[]> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const params = queryParams[key];

    if (params !== undefined && params !== null) {
      result[key] = typeof params === 'object' ? [...params.map((p) => String(p))] : [String(params)];
    }
  }

  return result;
};

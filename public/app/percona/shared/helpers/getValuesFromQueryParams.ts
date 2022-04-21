import { UrlQueryMap } from '@grafana/data';

export const getValuesFromQueryParams = (
  queryParams: UrlQueryMap,
  ...keys: string[]
): Record<string, string | undefined> => {
  const result: Record<string, string> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const param = queryParams[key];

    if (param !== undefined) {
      result[key] = String(param);
    }
  }

  return result;
};

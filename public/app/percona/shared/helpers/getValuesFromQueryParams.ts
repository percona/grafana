import { UrlQueryMap, UrlQueryValue } from '@grafana/data';

interface QueryParamTransform<T> {
  key: string;
  transform?: (param: UrlQueryValue) => T;
}

const defaultTransform = (params: UrlQueryValue): string[] => {
  if (params && params !== undefined && params !== null) {
    return typeof params === 'object' ? [...params.map((p) => String(p))] : [String(params)];
  }
  return [];
};

export const getValuesFromQueryParams = <T extends any[]>(
  queryParams: UrlQueryMap,
  keys: Array<QueryParamTransform<T>>
): [...T] => {
  const result = [];

  for (let i = 0; i < keys.length; i++) {
    const { key, transform = defaultTransform } = keys[i];
    const param = queryParams[key];

    if (param !== undefined && param !== null) {
      result.push(transform(param));
    }
  }

  return result as any;
};

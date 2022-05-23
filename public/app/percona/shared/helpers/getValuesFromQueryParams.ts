import { UrlQueryMap, UrlQueryValue } from '@grafana/data';

interface QueryParamTransform {
  key: string;
  transform?: (param: UrlQueryValue) => any;
}

const defaultTransform = (params: UrlQueryValue): string => {
  if (params && params !== undefined && params !== null) {
    return String(params);
  }
  return '';
};

export const getValuesFromQueryParams = <T extends any[]>(
  queryParams: UrlQueryMap,
  keys: QueryParamTransform[]
): [...T] => {
  const result: any[] = [];

  keys.forEach(({ key, transform = defaultTransform }) => {
    const param = queryParams[key];

    result.push(transform(param));
  });

  return result as any;
};

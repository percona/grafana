import { UrlQueryMap, UrlQueryValue } from '@grafana/data';

interface QueryParamTransform {
  key: string;
  transform?: (param: UrlQueryValue) => any;
}

const defaultTransform = (params: UrlQueryValue): Object => {
  if (params && params !== undefined && params !== null) {
    return typeof params === 'object' ? params.map((p) => String(p)) : [String(params)];
  }
  return [];
};

export const getValuesFromQueryParams = (queryParams: UrlQueryMap, keys: QueryParamTransform[]): Object => {
  let result: Object = {};

  keys.forEach(({ key, transform = defaultTransform }) => {
    const param = queryParams[key];

    if (param !== undefined && param !== null) {
      result = { ...result, [key]: transform(param) };
    }
  });

  return result;
};

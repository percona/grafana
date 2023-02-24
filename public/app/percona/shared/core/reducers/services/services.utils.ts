import { payloadToCamelCase } from 'app/percona/shared/helpers/payloadToCamelCase';
import {
  DbService,
  DbServiceWithAddress,
  ExternalService,
  ListServicesBody,
  PostgreSQLService,
  RemoveServiceBody,
  Service,
  ServiceListPayload,
} from 'app/percona/shared/services/services/Services.types';

import { ListServicesParams, RemoveServiceParams } from './services.types';

export const MAIN_COLUMNS = ['service_id', 'type', 'service_name', 'custom_labels', 'node_id', 'address', 'port'];

export const toRemoveServiceBody = (params: RemoveServiceParams): RemoveServiceBody => ({
  service_id: params.serviceId,
  force: params.force,
});

export const toListServicesBody = (params: Partial<ListServicesParams>): Partial<ListServicesBody> => ({
  node_id: params.nodeId,
  service_type: params.serviceType,
  external_group: params.externalGroup,
});

export const toDbServicesModel = (serviceList: ServiceListPayload): Service[] => {
  const result: Service[] = [];

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (Object.keys(serviceList) as Array<keyof ServiceListPayload>).forEach((serviceType) => {
    const serviceParams = serviceList[serviceType];
    serviceParams?.forEach((params) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const camelCaseParams = <DbService & DbServiceWithAddress & PostgreSQLService & ExternalService>(
        payloadToCamelCase(params)
      );
      const extraLabels: Record<string, string> = {};

      Object.entries(params)
        .filter(([field]) => !MAIN_COLUMNS.includes(field))
        .forEach(([key, value]: [string, string]) => {
          if (typeof value !== 'object' || Array.isArray(value)) {
            extraLabels[key] = value;
          }
        });

      if (!camelCaseParams.customLabels) {
        camelCaseParams.customLabels = {};
      }

      camelCaseParams.customLabels = { ...camelCaseParams.customLabels, ...extraLabels };

      result.push({
        type: serviceType,
        params: camelCaseParams,
      });
    });
  });

  return result;
};

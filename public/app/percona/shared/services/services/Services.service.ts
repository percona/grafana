import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import {
  AddCustomLabelsBody,
  ListServicesBody,
  ListTypesPayload,
  RemoveCustomLabelsBody,
  RemoveServiceBody,
  ServiceListPayload,
  UpdateServiceBody,
} from './Services.types';

export const ServicesService = {
  getActive(token?: CancelToken, disableNotifications?: boolean) {
    return api.post<ListTypesPayload, {}>('/v1/inventory/services:getTypes', {}, disableNotifications, token);
  },
  getServices(body: Partial<ListServicesBody> = {}, token?: CancelToken) {
    return api.post<ServiceListPayload, Partial<ListServicesBody>>('/v1/management/Service/List', body, false, token);
  },
  removeService(body: RemoveServiceBody) {
    return api.delete<{}>(`/v1/inventory/services/${body.service_id}`);
  },
  updateService(body: UpdateServiceBody, token?: CancelToken) {
    return api.put<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}`, body);
  },
  addCustomLabels(body: AddCustomLabelsBody) {
    return api.put<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}`, body);
  },
  removeCustomLabels(body: RemoveCustomLabelsBody) {
    return api.put<{}>(`/v1/inventory/services/${body.service_id}`, {});
  },
};

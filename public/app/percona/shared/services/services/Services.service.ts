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
  getServices(params: Partial<ListServicesBody> = {}, token?: CancelToken) {
    return api.get<ServiceListPayload, Partial<ListServicesBody>>('/v1/management/services', false, {
      cancelToken: token,
      params,
    });
  },
  removeService(body: RemoveServiceBody, token?: CancelToken) {
    return api.delete<{}>(`/v1/inventory/services/${body.service_id}`, false, token);
  },
  updateService(body: UpdateServiceBody, token?: CancelToken) {
    return api.put<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}`, body, false, token);
  },
  // todo: check custom labels functionality
  addCustomLabels(body: AddCustomLabelsBody, token?: CancelToken) {
    return api.put<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}`, body, false, token);
  },
  removeCustomLabels(body: RemoveCustomLabelsBody, token?: CancelToken) {
    return api.put<{}, unknown>(`/v1/inventory/services/${body.service_id}`, {}, false, token);
  },
};

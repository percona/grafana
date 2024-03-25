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

/*
* **ServicesService**                                 **ServicesService**
POST /v1/inventory/Services/Add                     POST /v1/inventory/services
POST /v1/inventory/Services/Get                     GET /v1/inventory/services/{id}
POST /v1/inventory/Services/List                    GET /v1/inventory/services

*
* */
export const ServicesService = {
  getActive(token?: CancelToken, disableNotifications?: boolean) {
    return api.get<ListTypesPayload, {}>('/v1/inventory/services/types', disableNotifications);
  },
  getServices(body: Partial<ListServicesBody> = {}, token?: CancelToken) {
    return api.post<ServiceListPayload, Partial<ListServicesBody>>('/v1/management/Service/List', body, false, token);
  },
  removeService(body: RemoveServiceBody) {
    return api.delete<{}, RemoveServiceBody>(`/v1/inventory/services/${body.service_id}`);
  },
  updateService(body: UpdateServiceBody, token?: CancelToken) {
    return api.put<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}`, body);
  },
  addCustomLabels(body: AddCustomLabelsBody, token?: CancelToken) {
    return api.post<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}/custom_labels`, body, false, token);
  },
  removeCustomLabels(body: RemoveCustomLabelsBody, token?: CancelToken) {
    return api.delete<{}, UpdateServiceBody>(`/v1/inventory/services/${body.service_id}/custom_labels`);
  },
};

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

const BASE_URL = `/v1/inventory/Services`;

export const ServicesService = {
  getActive(token?: CancelToken) {
    return api.post<ListTypesPayload, {}>(`${BASE_URL}/ListTypes`, {}, false, token);
  },
  getServices(body: Partial<ListServicesBody> = {}, token?: CancelToken) {
    return api.post<ServiceListPayload, Partial<ListServicesBody>>(`${BASE_URL}/List`, body, false, token);
  },
  removeService(body: RemoveServiceBody, token?: CancelToken) {
    return api.post<{}, RemoveServiceBody>(`${BASE_URL}/Remove`, body, false, token);
  },
  updateService(body: UpdateServiceBody, token?: CancelToken) {
    return api.post<{}, UpdateServiceBody>(`${BASE_URL}/Change`, body, false, token);
  },
  addCustomLabels(body: AddCustomLabelsBody, token?: CancelToken) {
    return api.post<{}, UpdateServiceBody>(`${BASE_URL}/CustomLabels/Add`, body, false, token);
  },
  removeCustomLabels(body: RemoveCustomLabelsBody, token?: CancelToken) {
    return api.post<{}, UpdateServiceBody>(`${BASE_URL}/CustomLabels/Remove`, body, false, token);
  },
};

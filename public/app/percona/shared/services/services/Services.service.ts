import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { ListServicesBody, RemoveServiceBody, ServiceListPayload } from './Services.types';

const BASE_URL = `/v1/inventory/Services`;

export const ServicesService = {
  getServices(body: Partial<ListServicesBody> = {}, token?: CancelToken) {
    return api.post<ServiceListPayload, Partial<ListServicesBody>>(`${BASE_URL}/List`, body, false, token);
  },
  removeService(body: RemoveServiceBody, token?: CancelToken) {
    return api.post<{}, RemoveServiceBody>(`${BASE_URL}/Remove`, body, false, token);
  },
};

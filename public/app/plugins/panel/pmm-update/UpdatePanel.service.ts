import { api } from 'app/percona/shared/helpers/api';

import {
  GetUpdatesBody,
  GetUpdateStatusBody,
  GetUpdatesResponse,
  GetUpdateStatusResponse,
  StartUpdateResponse,
} from './types';

export const getCurrentVersion = () =>
api.get<GetUpdatesResponse, GetUpdatesBody>('/v1/server/updates');
export const startUpdate = () => api.post<StartUpdateResponse, {}>('/v1/server/updates:start', {});
export const getUpdateStatus = (body: GetUpdateStatusBody) =>
  api.post<GetUpdateStatusResponse, GetUpdateStatusBody>('/v1/server/updates:getStatus', body);

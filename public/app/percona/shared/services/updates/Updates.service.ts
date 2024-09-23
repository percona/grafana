import {
  CheckUpdatesChangelogsPayload,
  SnoozePayloadBody,
  SnoozePayloadResponse,
} from 'app/percona/shared/core/reducers/updates';

import { api } from '../../helpers/api';

import { CheckUpdatesParams, CheckUpdatesResponse } from './Updates.types';

export const UpdatesService = {
  getCurrentVersion: (params: CheckUpdatesParams = { force: false }) =>
    api.get<CheckUpdatesResponse, CheckUpdatesParams>('/v1/server/updates', true, { params }),
  getUpdatesChangelogs: () => api.get<CheckUpdatesChangelogsPayload>('/v1/server/updates/changelogs', false),

  snoozeCurrentVersion: (body: SnoozePayloadBody) =>
    api.put<SnoozePayloadResponse, SnoozePayloadBody>('/v1/users/me', body, true),

  getSnoozeCurrentVersion: () => api.get<SnoozePayloadResponse>('/v1/users/me', false),
};

import {
  CheckUpdatesChangeLogsResponse,
  SnoozePayloadBody,
  SnoozePayloadResponse,
} from 'app/percona/shared/core/reducers/updates';

import { api } from '../../helpers/api';

import { CheckUpdatesParams, CheckUpdatesResponse } from './Updates.types';

export const UpdatesService = {
  getCurrentVersion: (body: CheckUpdatesParams = { force: false }) =>
    api.get<CheckUpdatesResponse, CheckUpdatesParams>('/v1/server/updates', true, { params: body }),

  getUpdatesChangelogs: () => api.get<CheckUpdatesChangeLogsResponse, void>('/v1/server/updates/changelogs', false),

  setSnoozeCurrentVersion: (body: SnoozePayloadBody) =>
    api.put<SnoozePayloadResponse, SnoozePayloadBody>('/v1/users/me', body, true),

  getSnoozeCurrentVersion: () => api.get<SnoozePayloadResponse, void>('/v1/users/me', false),
};

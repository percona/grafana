import { api } from '../../helpers/api';

import { CheckUpdatesBody, CheckUpdatesResponse } from './Updates.types';

export const UpdatesService = {
  getCurrentVersion: (params: CheckUpdatesBody = { force: false }) =>
    api.get<CheckUpdatesResponse, CheckUpdatesBody>('/v1/server/updates', true, { params }),
};

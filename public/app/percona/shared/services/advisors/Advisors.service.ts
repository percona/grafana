import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { Advisor } from './Advisors.types';

const BASE_URL = `/v1/management/Advisors`;

export const AdvisorsService = {
  async list(token?: CancelToken, disableNotifications?: boolean): Promise<unknown> {
    return api.post<Advisor[], void>(`${BASE_URL}/List`, undefined, disableNotifications, token);
  },
};

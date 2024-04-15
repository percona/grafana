import { CancelToken } from 'axios';

import { api } from '../../helpers/api';

import { Advisor } from './Advisors.types';

const BASE_URL = `/v1/advisors`;

export const AdvisorsService = {
  async list(): Promise<{ advisors: Advisor[] }> {
    return api.get<{ advisors: Advisor[] }, void>(`${BASE_URL}`);
  },
};

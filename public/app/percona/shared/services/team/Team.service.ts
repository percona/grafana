import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { TeamListResponse } from './Team.types';

const BASE_URL = '/v1/team';

export const TeamService = {
  listDetails: (cancelToken?: CancelToken): Promise<TeamListResponse> =>
    api.post(`${BASE_URL}/list`, undefined, false, cancelToken),
};

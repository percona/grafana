import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { HighAvailabilityNodesResponse, HighAvailabilityStatusResponse } from './HighAvailability.types';

const BASE_URL = '/v1/ha';

export const HighAvailabilityService = {
  getStatus: async (token?: CancelToken) => {
    return api.get<HighAvailabilityStatusResponse, void>(`${BASE_URL}/status`, true, { cancelToken: token });
  },
  getNodes: async (token?: CancelToken): Promise<HighAvailabilityNodesResponse> => {
    return api.get<HighAvailabilityNodesResponse, void>(`${BASE_URL}/nodes`, true, { cancelToken: token });
  },
};

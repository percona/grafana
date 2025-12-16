import { api } from 'app/percona/shared/helpers/api';

import { HighAvailabilityNodesResponse, HighAvailabilityStatusResponse } from './HighAvailability.types';

const BASE_URL = '/v1/ha';

export const HighAvailabilityService = {
  getStatus: async () => {
    return api.get<HighAvailabilityStatusResponse, void>(`${BASE_URL}/status`);
  },
  getNodes: async (): Promise<HighAvailabilityNodesResponse> => {
    return api.get<HighAvailabilityNodesResponse, void>(`${BASE_URL}/nodes`);
  },
};

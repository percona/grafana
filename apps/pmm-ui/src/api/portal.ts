import { ApiResource } from './api';
import { Config } from '../config';

const apiTelemetryOnboarding = new ApiResource({ baseURL: Config.portal.baseUrl });

export const PortalAPI = {
  createFeedback: async (rate: string, description: string, pmmServerId: string) => {
    return await apiTelemetryOnboarding.post<any, any>('/v1/telemetry/onboarding/feedback', {
      rate,
      description,
      pmm_server_id: pmmServerId,
    });
  },
};

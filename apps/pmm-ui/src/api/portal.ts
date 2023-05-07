import { ApiResource } from './api';
import { Config } from '../config';
import { Rating } from 'components/Feedback/Feedback';

const apiTelemetryOnboarding = new ApiResource({ baseURL: Config.portal.baseUrl });

export const PortalAPI = {
  createFeedback: async (rating: Rating, description: string, pmmServerId: string) => {
    return await apiTelemetryOnboarding.post<any, any>('/v1/telemetry/onboarding/feedback', {
      rating,
      description,
      pmm_server_id: pmmServerId,
    });
  },
};

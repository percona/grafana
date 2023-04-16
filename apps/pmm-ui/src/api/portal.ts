import { ApiResource } from './api';
import moment from 'moment';
import {Config} from "../config";

const apiTelemetryOnboarding = new ApiResource({ baseURL: Config.portal.baseUrl });

export const PortalAPI = {
  createFeedback: async (rate: string, description: string, pmmServerId: string) => {
    return await apiTelemetryOnboarding.post<any, any>('/v1/telemetry/onboarding/feedback', {
      feedback_rate: rate,
      feedback_description: description,
      feedback_date: moment(new Date()).format('YYYY-MM-DD'),
      pmm_server_id: pmmServerId,
    });
  },
};

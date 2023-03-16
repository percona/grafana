import { apiTelemetryOnboarding } from '../../shared/api';
import moment from 'moment';

const api = {
  createFeedback: async (rate: string, description: string, pmmServerId: string) => {
    return await apiTelemetryOnboarding.post<any, any>('/feedback', {
      feedback_rate: rate,
      feedback_description: description,
      feedback_date: moment(new Date()).format('YYYY-MM-DD'),
      pmm_server_id: pmmServerId,
    });
  },
};

export default api;

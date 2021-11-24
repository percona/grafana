import { EmailPayload } from '../../Settings.types';
import { api } from 'app/percona/shared/helpers/api';

export const CommunicationService = {
  async testEmailSettings(settings: EmailPayload): Promise<void> {
    return api.post<void, EmailPayload>('/v1/Settings/TestEmailAlertingSettings', settings);
  },
};

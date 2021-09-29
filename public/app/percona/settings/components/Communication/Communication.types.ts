import { LoadingCallback } from 'app/percona/settings/Settings.service';
import { AlertingSettings, EmailPayload, SlackPayload } from '../../Settings.types';

export interface CommunicationProps {
  alertingSettings: AlertingSettings;
  updateSettings: (body: EmailPayload | SlackPayload, callback: LoadingCallback) => void;
}

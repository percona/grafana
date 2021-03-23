import { LoadingCallback } from 'app/percona/settings/Settings.service';
import { AlertingSettings, SettingsAPI } from '../../Settings.types';

export interface CommunicationProps {
  alertingEnabled: boolean;
  alertingSettings: AlertingSettings;
  updateSettings: (body: SettingsAPI, callback: LoadingCallback) => void;
}

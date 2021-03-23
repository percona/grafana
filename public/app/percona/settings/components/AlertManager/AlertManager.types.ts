import { LoadingCallback } from 'app/percona/settings/Settings.service';
import { SettingsAPI } from '../../Settings.types';

export interface AlertManagerProps {
  alertManagerUrl: string;
  alertManagerRules: string;
  updateSettings: (
    body: Pick<SettingsAPI, 'alert_manager_url' | 'alert_manager_rules'>,
    callback: LoadingCallback
  ) => void;
}

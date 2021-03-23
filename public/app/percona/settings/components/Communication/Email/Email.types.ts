import { EmailAuthType, EmailSettings, SettingsAPI } from '../../../Settings.types';
import { LoadingCallback } from '../../../Settings.service';

export interface EmailProps {
  settings: EmailSettings;
  updateSettings: (body: Pick<SettingsAPI, 'email_alerting_settings'>, callback: LoadingCallback) => void;
}

export interface FormEmailSettings extends Omit<EmailSettings, 'identity' | 'secret'> {
  authType: EmailAuthType;
}
